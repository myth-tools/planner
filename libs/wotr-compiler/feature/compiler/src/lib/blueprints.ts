import { rm, mkdir } from 'fs/promises';
import { join } from 'path';
import { Options } from '../data-models/options';
import { Directory } from '../data-models/directory';
import { async as Zip, ZipEntry } from 'node-stream-zip';

export class Blueprints {
    constructor(private readonly options: Options) {}

    public async extract(foldersOfInterest: string[]) {
        console.time('Time taken');

        const fileName = join(this.options.root, this.options.file);
        const zip = new Zip({ file: fileName });

        let total = 0;

        try {
            console.log(`Extracting...`);

            const zipEntries = await zip.entries();
            const directories = this.filterEntries(Object.values(zipEntries), foldersOfInterest);

            for (const directory of directories) {
                const output = join(this.options.output, directory.name);

                await mkdir(output, { recursive: true });
                const files = await zip.extract(directory.name, output);

                total += files;

                console.log(`- ${directory.name} (${files} files)`);
            }
        } finally {
            await zip.close();

            console.log(`---\nTotal Files: ${total}`);
            console.timeEnd('Time taken');
        }
    }

    public async clean() {
        return rm(this.options.output, { recursive: true, force: true });
    }

    private filterEntries(entries: ZipEntry[], foldersOfInterest: string[]) {
        return entries.reduce<Directory[]>((result, current) => {
            if (!current.isDirectory) {
                return result;
            }

            const directory = new Directory(current.name);

            if (directory.isRoot && foldersOfInterest.some(folder => directory.name === folder)) {
                result.push(directory);
            }

            return result;
        }, []);
    }
}
