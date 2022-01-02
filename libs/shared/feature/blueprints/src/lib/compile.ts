import { fdir, GroupOutput } from 'fdir';
import { createReadStream, createWriteStream, ReadStream, WriteStream } from 'fs';
import { sep } from 'path';

export class Compile {
    public async execute(input: string) {
        const directories = await this.getDirectoryMap(input);

        console.log(Array.from(directories.entries()).map(value => ({ key: value[0], files: value[1].length })));
        console.log(Array.from(directories.keys()).length);
    }

    private async compileOutput(directories: Map<string, string[]>) {
        for (const [fileName, files] of directories.entries()) {
            const output = createWriteStream(fileName);

            for (const file of files) {
                const fileStream = createReadStream(file);

                await this.copy(fileStream, output);
            }

            output.end();
        }
    }

    private async getDirectoryMap(input: string) {
        const directoryGroups = (await new fdir().group().crawl(input).withPromise()) as GroupOutput;

        const directories = directoryGroups.reduce((result, current) => {
            // ignore directories without files, this is most likely directories only containing other directories.
            if (!current.files.length) {
                return result;
            }

            const key = this.kebabCase(current.dir.replace(`${input}/`, '').split(sep)[0]);

            result.set(key, [...(result.get(key) || []), ...current.files]);

            return result;
        }, new Map<string, string[]>());

        return directories;
    }

    private async copy(source: ReadStream, target: WriteStream) {
        return new Promise<void>((resolve, reject) => {
            source.pipe(target, { end: false });

            target.on('error', reject);
            source.on('error', reject);
            source.on('end', resolve);
        });
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
