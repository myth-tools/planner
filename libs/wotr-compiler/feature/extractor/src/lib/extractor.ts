import { dirname, parse } from 'path';
import { BinaryReader } from './binary/binary-reader';
import { FileType } from './data-models/file-type';
import { FileReader } from './files/file-reader';
import { Import } from './utils/import';

interface AssetsFileIndex {
    [index: string]: number;
}

interface ResourceFileHeadersIndex {
    [index: string]: BinaryReader;
}

export class Extractor {
    public assetsFileList = [];

    private assetsFileIndexCache: AssetsFileIndex = {};
    private resourceFileHeaders: ResourceFileHeadersIndex = {};

    private importFiles: string[] = [];
    private importFilesHash = new Set<string>();
    private assetsFileListHash = new Set<string>();

    public async loadFiles(files: string[]) {
        const path = dirname(files[0]);

        await Import.mergeSplitAssets(path);
        const toReadFiles = await Import.processSplitFiles(files);

        return this.load(toReadFiles);
    }

    private async load(files: string[]) {
        for (const file of files) {
            const { name } = parse(file);

            this.importFiles.push(file);
            this.importFilesHash.add(name);
        }

        for (let i = 0; i < this.importFiles.length; i++) {
            await this.loadFile(this.importFiles[i]);
        }

        this.importFiles.length = 0;
        this.importFilesHash.clear();
        this.assetsFileListHash.clear();

        // readassets
        // processassets
    }

    private async loadFile(fileName: string);
    private async loadFile(reader: FileReader);
    private async loadFile(reader: string | FileReader) {
        if (!(reader instanceof FileReader)) {
            reader = await new FileReader(reader).open();
        }

        switch (reader.fileType) {
            case FileType.AssetsFile:
                break;
            case FileType.BundleFile:
                break;
            case FileType.WebFile:
                break;
            case FileType.GZipFile:
                reader = await Import.decompressGZip(reader);
                await this.loadFile(reader);
                break;
            case FileType.BrotliFile:
                reader = await Import.decompressBrotli(reader);
                await this.loadFile(reader);
                break;
            case FileType.ZipFile:
                break;
        }
    }
}
