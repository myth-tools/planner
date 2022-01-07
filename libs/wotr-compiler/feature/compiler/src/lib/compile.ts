import { fdir, GroupOutput } from 'fdir';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { join, normalize, sep } from 'path';
import { CompileOptions } from '../data-models/options';
import { WriteStreamEx } from '../utils/write-stream-ex';

interface ManifestBlueprint {
    name: string;
    blueprints: ManifestBlueprint[];
}

export class Compile {
    public async execute({ extractFolder, compileFolder, manifestFileName, indexFileName }: CompileOptions) {
        console.log(`\nWriting to ${compileFolder}`);

        await this.clean(compileFolder);

        console.time(`\nFinished compiling blueprints in`);

        const directories = await this.getDirectoryMap(extractFolder);

        console.log(`Found ${directories.length} directories`);

        const outputStream = new WriteStreamEx(createWriteStream(`${join(compileFolder, `test.json`)}`));

        await outputStream.write(`[`);
        // await this.writeManifest(directories, compileFolder, manifestFileName, indexFileName);
        await this.compileOutput(directories, compileFolder, indexFileName, outputStream);
        await outputStream.write(`]`);

        await outputStream.end();

        console.timeEnd(`\nFinished compiling blueprints in`);
        console.log(); // add a new line to console.
    }

    /** Delete and re-create the output directory, ready for another run. */
    private async clean(output: string) {
        await rm(output, { recursive: true, force: true });
        await mkdir(output, { recursive: true });
    }

    /** Write all file content to output files in parallel. */
    private async compileOutput(directory: any[], output: string, indexFileName: string, outputStream: WriteStreamEx) {
        let count = 0;

        for (const { name, files, directories } of directory) {
            count += 1;
            await outputStream.write(`{\n"n": "${name}",\n"f": [`);

            for (const [index, file] of files.entries()) {
                const fileStream = createReadStream(file);

                try {
                    await outputStream.write(
                        `{\n"p": [${file
                            .replace(`blueprints${sep}`, '')
                            .split(sep)
                            .map(this.kebabCase)
                            .map(str => `"${str}"`)
                            .join(', ')}],\n"e": `
                    );
                    await outputStream.copyFrom(fileStream);

                    await outputStream.write('\n}');

                    if (index !== files.length - 1) {
                        await outputStream.write(`,\n`);
                    }
                } catch (error) {
                    console.error(error);
                    break;
                }
            }

            await outputStream.write(`],\n"d": [`);

            if (directories.length) {
                await this.compileOutput(directories, output, indexFileName, outputStream);
            }

            await outputStream.write(`]}`);

            if (count !== directory.length) {
                await outputStream.write(`,\n`);
            }

            //await this.writeFilesToOutput(name, files, output, indexFileName, outputStream);
        }
        /* const writeFiles = entries.map(([fileName, files]) =>
            this.writeFilesToOutput(fileName, files, output, indexFileName, outputStream)
        );

        await Promise.all(writeFiles); */

        // await outputStream.write('}');
    }

    private async writeManifest(
        directories: string[],
        output: string,
        manifestFileName: string,
        indexFileName: string
    ) {
        const manifest: ManifestBlueprint[] = [];

        for (const directory of directories) {
            const parts = directory.split(sep);

            parts.reduce((result, current, index, array) => {
                let blueprint = result.find(blueprintPart => blueprintPart.name === current);

                if (!blueprint) {
                    blueprint = { name: current, blueprints: [] };
                    result.push(blueprint);
                }

                // If we are the last part, then add the entities.
                if (index === array.length - 1) {
                    blueprint.blueprints.push({ name: join(directory, `${indexFileName}.json`), blueprints: [] });
                }

                return blueprint.blueprints;
            }, manifest);
        }

        const outputStream = new WriteStreamEx(createWriteStream(`${join(output, `${manifestFileName}.json`)}`));

        await outputStream.write(JSON.stringify(manifest));
        await outputStream.end();

        console.log(`Wrote ${manifestFileName}.json\n`);
    }

    private async writeFilesToOutput(
        fileName: string,
        files: string[],
        output: string,
        indexFileName: string,
        outputStream: WriteStreamEx
    ) {
        console.time(`- ${files.length} '${fileName}' files written in`);

        /* const outputPath = join(output, fileName);
        await mkdir(outputPath, { recursive: true });

        const outputStream = new WriteStreamEx(createWriteStream(`${join(outputPath, `${indexFileName}.json`)}`));
        await outputStream.write('['); */

        /*
            [
                { name: 'achievements', entities: [{}], directories: [] }
            ]
        */

        for (const [index, file] of files.entries()) {
            const fileStream = createReadStream(file);

            try {
                await outputStream.write(
                    `{\n"file": [${file
                        .replace(`blueprints${sep}`, '')
                        .split(sep)
                        .map(this.kebabCase)
                        .map(str => `"${str}"`)
                        .join(', ')}],\n"entity": `
                );
                await outputStream.copyFrom(fileStream);

                if (index === files.length - 1) {
                    await outputStream.write('\n}');
                } else {
                    await outputStream.write(`\n},\n`);
                }
            } catch (error) {
                console.error(error);
                break;
            }
        }

        /* await outputStream.write(']');
        await outputStream.end(); */

        console.timeEnd(`- ${files.length} '${fileName}' files written in`);
    }

    /** Get all blueprint files into an easy to parse format for writing. */
    private async getDirectoryMap(input: string) {
        const directoryGroups = (await new fdir().group().withBasePath().crawl(input).withPromise()) as GroupOutput;

        const test = directoryGroups.reduce((result, current) => {
            // ignore directories without files, this is most likely directories only containing other directories.
            if (!current.files.length) {
                return result;
            }

            const parts = current.dir.replace(`${input}${sep}`, '').split(sep).map(this.kebabCase);

            let parent = result; // result.find(r => r.name === parts[0]);

            // classes/archanist/archtypes/eldrith-font
            for (const [index, part] of parts.entries()) {
                let _parent = parent.find(r => r.name === part);

                /* if (parent) {
                    const bb = parent.directories.find(v => v.name === part);

                    if (bb) {
                        parent = bb;
                    } else {
                        const v = { name: part, files: [], directories: [] };
                        parent.directories.push(v);
                        parent = v;
                    }
                } else  */
                if (!_parent) {
                    const bbb = { name: part, files: [], directories: [] };
                    parent.push(bbb);
                    _parent = bbb;
                }

                if (index === parts.length - 1) {
                    _parent.files = current.files;
                }

                parent = _parent.directories;
            }

            return result;
        }, []);

        return test;
        /* const directories = directoryGroups.reduce((result, current) => {
            // ignore directories without files, this is most likely directories only containing other directories.
            if (!current.files.length) {
                return result;
            }

            // remove the base dir, kebab case each part of the folder path then re-join it.
            const key = current.dir.replace(`${input}${sep}`, '').split(sep).map(this.kebabCase).join(sep);

            result.set(key, [...(result.get(key) || []), ...current.files]);

            return result;
        }, new Map<string, string[]>());

        return directories; */
    }

    // https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-123.php
    private kebabCase(str: string) {
        return (
            str &&
            str
                .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(match => match.toLowerCase())
                .join('-')
        );
    }
}
