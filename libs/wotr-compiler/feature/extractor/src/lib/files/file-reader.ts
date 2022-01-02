import { stat } from 'fs/promises';
import { FileStream, Stream } from 'ia-stream';
import { resolve } from 'path';
import { BinaryReader } from '../binary/binary-reader';
import { EndianType } from '../data-models/endian-type';
import { FileType } from '../data-models/file-type';
import { Signature } from '../data-models/signature';
import { getFileName } from '../utils/io';

export class FileReader extends BinaryReader {
    public fullPath: string;
    public fileName: string;
    public fileType: FileType;

    private _length: number;

    private readonly gzipMagic = Buffer.from([0x1f, 0x8b]);
    private readonly brotliMagic = Buffer.from([0x62, 0x72, 0x6f, 0x74, 0x6c, 0x69]);
    private readonly zipMagic = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    private readonly zipSpannedMagic = Buffer.from([0x50, 0x4b, 0x07, 0x08]);

    public get length() {
        return this._length;
    }

    constructor(private readonly path: string) {
        super(EndianType.BigEndian);
    }

    public async open(stream?: Stream) {
        const { size } = await stat(this.path);
        this._length = size;

        await super.open(stream ?? (await FileStream.open(this.path, { flags: 'r' })));

        this.fullPath = resolve(this.path);
        this.fileName = getFileName(this.path);
        this.fileType = await this.checkFileType();

        return this;
    }

    private async checkFileType() {
        const signature = await this.readStringToNull(20);

        this.position = 0;

        switch (signature) {
            case Signature.Web:
            case Signature.Raw:
            case Signature.Archive:
            case Signature.FS:
                return FileType.BundleFile;
            case Signature.WebData1:
                return FileType.WebFile;
            default: {
                let magic = Buffer.from(await this.readBytes(2));

                this.position = 0;

                if (this.gzipMagic.compare(magic)) {
                    return FileType.GZipFile;
                }

                this.position = 0x20;

                magic = Buffer.from(await this.readBytes(6));
                this.position = 0;

                if (this.brotliMagic.compare(magic)) {
                    return FileType.BrotliFile;
                }

                if (this.isSerializedFile()) {
                    return FileType.AssetsFile;
                }

                magic = Buffer.from(await this.readBytes(4));
                this.position = 0;

                if (this.zipMagic.compare(magic) || this.zipSpannedMagic.compare(magic)) {
                    return FileType.ZipFile;
                }

                return FileType.ResourceFile;
            }
        }
    }

    private async isSerializedFile() {
        const size = this.length;

        if (size < 20) {
            return false;
        }

        await this.readUInt32(); // metadataSize
        let fileSize: number | bigint = await this.readUInt32();
        const version = await this.readUInt32();
        let dataOffset: number | bigint = await this.readUInt32();
        await this.readByte(); // endianess
        await this.readBytes(3); // reserved

        if (version >= 22) {
            if (fileSize < 48) {
                this.position = 0;
                return false;
            }

            await this.readUInt32(); // metadata size
            fileSize = await this.readInt64();
            dataOffset = await this.readInt64();
        }

        this.position = 0;

        if (fileSize != size) {
            return false;
        }

        if (dataOffset > fileSize) {
            return false;
        }

        return true;
    }
}
