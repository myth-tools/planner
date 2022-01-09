import { exists } from '@myth-tools/utils/shared/node';
import { mkdir, rm } from 'fs/promises';
import { async as Zip, StreamZipAsync, ZipEntry } from 'node-stream-zip';
import { join } from 'path';
import { Entry } from './models/entry';
import { ExtractOptions } from './models/options';

export class Extract {
    public async execute({ gameDirectory, zipFileName, extractToFolderPath, force }: ExtractOptions) {
        const isExtracted = await exists(extractToFolderPath);

        // If we already have an extract and we aren't forcing a clean run, don't extract again.
        if (isExtracted && force === false) {
            console.log(`Extract is up to date. Skipping...`);
            return;
        }

        const fileName = join(gameDirectory, zipFileName);

        console.log(`\nExtracting files from: ${fileName}\n`);

        await this.clean(extractToFolderPath);

        console.time('Time taken');

        const total = await this.extract(fileName, extractToFolderPath);

        console.log(`---\nTotal Files: ${total}`);
        console.timeEnd('Time taken');
    }

    private async clean(output: string) {
        await rm(output, { recursive: true, force: true });
        await mkdir(output, { recursive: true });
    }

    private async extract(fileName: string, output: string) {
        const zip = new Zip({ file: fileName });

        try {
            const entries = Object.values(await zip.entries())
                .filter(this.filterEntries)
                .map(async entry => this.extractEntry(zip, entry, output));

            const files = await Promise.all(entries);

            return files.reduce((total, value) => total + value, 0);
        } finally {
            await zip.close();
        }
    }

    private filterEntries(entry: ZipEntry) {
        const directory = new Entry(entry.name);

        // Only extract the root folders and files as all sub directories are already going to be extracted as part of this.
        if (!directory.isRoot) {
            return false;
        }

        // Ignore the world directory, it's too big, contains invalid file paths and not relevant for the project.
        if (directory.base === 'World') {
            return false;
        }

        return true;
    }

    private async extractEntry(zip: StreamZipAsync, entry: ZipEntry, output: string) {
        const directory = new Entry(entry.name);

        const extractTo = join(output, directory.name);

        if (entry.isDirectory) {
            await mkdir(extractTo, { recursive: true });
        }

        const files = await zip.extract(entry.name, extractTo);

        if (entry.isDirectory) {
            console.log(`- ${directory.name} (${files}) files`);
        }

        return files || 1; // Individual files don't return a count, so just return 1 for the file.
    }
}
