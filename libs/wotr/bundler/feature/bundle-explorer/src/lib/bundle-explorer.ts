import { WriteStreamEx } from '@myth-tools/node/utils/file-system';
import { fdir, GroupOutput } from 'fdir';
import { createReadStream, createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { kebabCase } from 'lodash';
import { join, sep } from 'path';
import { Directory } from './models/directory';
import { Options } from './models/options';

export class BundleExplorer {
    public async execute({ extractToFolderPath, outputFilePath, outputFileName }: Options) {
        const outputFile = join(outputFilePath, `${outputFileName}.json`);
        console.log(`\nWriting to ${outputFile}\n`);

        await this.clean(outputFile);

        console.time(`\nFinished compiling blueprints in`);

        const directories = await this.getDirectories(extractToFolderPath);

        const output = new WriteStreamEx(createWriteStream(outputFile));

        try {
            await output.write(`[`);
            await this.compileOutput(directories, output, extractToFolderPath, true);
            await output.write(`]`);
        } finally {
            await output.end();
        }

        console.timeEnd(`\nFinished compiling blueprints in`);
    }

    private async compileOutput(
        entries: Directory[],
        output: WriteStreamEx,
        extractToFolderPath: string,
        isTopLevel: boolean
    ) {
        entries.sort((a, b) => a.name.localeCompare(b.name));

        for (const [index, { name, files, directories }] of entries.entries()) {
            await output.write(`{"n":"${name}","f":[`);

            // Add files.
            if (files.length) {
                await this.writeFiles(files, output, extractToFolderPath);
            }

            await output.write(`],"d":[`);

            // Add child directories.
            if (directories.length) {
                await this.compileOutput(directories, output, extractToFolderPath, false);
            }

            await output.write(`]}`);

            if (index !== entries.length - 1) {
                await output.write(`,`);
            }

            if (isTopLevel) {
                console.log(`- ${name} (${directories.length} directories, ${files.length} files)`);
            }
        }
    }

    private async writeFiles(files: string[], output: WriteStreamEx, extractToFolderPath: string) {
        files.sort((a, b) => a.localeCompare(b));

        for (const [index, file] of files.entries()) {
            const fileStream = createReadStream(file);

            const paths = file
                .replace(`${extractToFolderPath}${sep}`, '')
                .split(sep)
                .map(kebabCase)
                .map(str => `"${str.replace('-jbp', '.jbp')}"`)
                .join(', ');

            await output.write(`{"p":[${paths}],"e":`);
            await output.copyFrom(fileStream);
            await output.write('}');

            if (index !== files.length - 1) {
                await output.write(`,`);
            }
        }
    }

    private async clean(output: string) {
        try {
            await unlink(output);
        } catch {
            return;
        }
    }

    private async getDirectories(extractToFolderPath: string) {
        const directoryGroups = (await new fdir()
            .group()
            .withBasePath()
            .crawl(extractToFolderPath)
            .withPromise()) as GroupOutput;

        const directories = directoryGroups.reduce<Directory[]>((result, current) => {
            // ignore directories without files, this is most likely directories only containing other directories.
            if (!current.files.length) {
                return result;
            }

            // Add files from root directory to the misc folder.
            if (current.dir === extractToFolderPath) {
                current.dir = 'misc';
            }

            const paths = current.dir.replace(`${extractToFolderPath}${sep}`, '').split(sep).map(kebabCase);

            // Start with top level result.
            let directories = result;

            for (const [index, name] of paths.entries()) {
                let directory = directories.find(directory => directory.name === name);

                // Create a new directory if it doesn't exist.
                if (!directory) {
                    const newDirectory: Directory = { name, files: [], directories: [] };
                    directories.push(newDirectory);
                    directory = newDirectory;
                }

                // If we are the last part of the directory, we must be at the files.
                if (index === paths.length - 1) {
                    directory.files = current.files;
                }

                directories = directory.directories;
            }

            return result;
        }, []);

        return directories;
    }
}
