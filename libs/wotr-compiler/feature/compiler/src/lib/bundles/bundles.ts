import { FileReader } from './io/file-reader';
import { join, dirname } from 'path';
import { exists } from './utils/io';
import { mkdir, open } from 'fs/promises';
import { FileType } from './data-models/file-type';
import { BundleFile } from './io/files/bundle-file';
import { WebFile } from './io/files/web-file';
import { StreamFile } from './data-models/stream-file';

export class Bundles {
    public async extract(fileName: string, output: string) {
        let extractedCount = 0;

        const reader = await new FileReader(fileName).open();
        console.log(reader.fileType);
        switch (reader.fileType) {
            case FileType.BundleFile:
                extractedCount += await this.extractBundleFile(reader, output);
                break;
            case FileType.WebFile:
                extractedCount += await this.extractWebDataFile(reader, output);
                break;
            default:
                await reader.close();
        }

        return extractedCount;
    }

    private async extractBundleFile(reader: FileReader, output: string) {
        const bundleFile = new BundleFile(reader);
        await bundleFile.open();
        await reader.close();

        if (bundleFile.fileList.length > 0) {
            const extractPath = join(output, `${reader.fileName}_unpacked`);

            return this.extractStreamFile(extractPath, bundleFile.fileList);
        }

        return 0;
    }

    private async extractWebDataFile(reader: FileReader, output: string) {
        const webFile = new WebFile(reader);
        await reader.close();

        if (webFile.fileList.length > 0) {
            const extractPath = join(output, reader.fileName, '_unpacked');

            return this.extractStreamFile(extractPath, webFile.fileList);
        }

        return 0;
    }

    private async extractStreamFile(extractPath: string, fileList: StreamFile[]) {
        let extractedCount = 0;

        for (const file of fileList) {
            console.log(file.fileName);
            const filePath = join(extractPath, file.path);
            const fileDirectory = dirname(filePath);

            if (!(await exists(fileDirectory))) {
                await mkdir(fileDirectory, { recursive: true });
            }

            if (!(await exists(filePath))) {
                const fileHandle = await open(filePath, 'w');
                await fileHandle.write(await file.stream.read(file.stream.length));
                //createWriteStream(filePath).write(await file.stream.read(file.stream.length));
                // await pipeline(file.stream.asNodeStream(), createWriteStream(filePath));
                extractedCount += 1;
            }

            await file.stream.close();
        }

        return extractedCount;
    }
}
