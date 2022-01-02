import { rm } from 'fs/promises';
import { FileStream, MemoryStream, Stream } from 'ia-stream';
import { sep } from 'path';
import { BinaryReader } from '../binary/binary-reader';
import { Signature } from '../data-models/signature';
import { StreamFile } from '../data-models/stream-file';
import { exists, getFileName } from '../utils/io';
import { FileReader } from './file-reader';
import { decodeBlock } from 'lz4';
import { Header } from './data-models/bundle-header';
import { StorageBlock } from './data-models/bundle-storage-block';
import { Node } from './data-models/bundle-node';

export class BundleFile {
    public readonly header = new Header();
    public fileList: StreamFile[] = [];

    private blocksInfo: StorageBlock[] = [];
    private directoryInfo: Node[] = [];

    constructor(private readonly reader: FileReader) {}

    public async open() {
        this.header.signature = await this.reader.readStringToNull();
        this.header.version = await this.reader.readUInt32();
        this.header.unityVersion = await this.reader.readStringToNull();
        this.header.unityRevision = await this.reader.readStringToNull();

        switch (this.header.signature) {
            case Signature.Archive:
                break; // TODO
            case Signature.Web:
            case Signature.Raw:
                if (this.header.version !== 6) {
                    await this.readHeaderAndBlocksInfo(this.reader);
                    const blocksStream = await this.createBlocksStream(this.reader.fullPath);

                    try {
                        await this.readBlocksAndDirectory(this.reader, blocksStream);
                        await this.readFiles(blocksStream, this.reader.fullPath);
                    } finally {
                        if (blocksStream instanceof FileStream && (await exists(`${this.reader.fullPath}.temp`))) {
                            await rm(`${this.reader.fullPath}.temp`, { recursive: true, force: true });
                        }

                        await blocksStream.close();
                    }

                    break;
                }
            // eslint-disable-next-line no-fallthrough
            case Signature.FS: {
                await this.readHeader(this.reader);
                await this.readBlocksInfoAndDirectory(this.reader);

                const blocksStream = await this.createBlocksStream(this.reader.fullPath);

                try {
                    await this.readBlocks(this.reader, blocksStream);
                    await this.readFiles(blocksStream, this.reader.fullPath);
                } finally {
                    if (blocksStream instanceof FileStream && (await exists(`${this.reader.fullPath}.temp`))) {
                        await rm(`${this.reader.fullPath}.temp`, { recursive: true, force: true });
                    }

                    await blocksStream.close();
                }

                break;
            }
        }
    }

    private async readHeaderAndBlocksInfo(reader: BinaryReader) {
        const isCompressed = this.header.signature === Signature.Web;

        if (this.header.version >= 4) {
            await reader.readBytes(16); // hash
            await reader.readUInt32(); // crc
        }

        await reader.readUInt32(); // minimum streamed bytes

        this.header.size = await reader.readUInt32();

        await reader.readUInt32(); // number of levels to download before streaming
        const levelCount = await reader.readUInt32();

        this.blocksInfo = [];

        for (let i = 0; i < levelCount; i++) {
            const compressedSize = await reader.readUInt32();
            const uncompressedSize = await reader.readUInt32();

            const storageBlock = new StorageBlock({
                compressedSize,
                uncompressedSize,
                flags: isCompressed ? 1 : 0
            });

            if (i === levelCount - 1) {
                this.blocksInfo[0] = storageBlock;
            }
        }

        if (this.header.version >= 2) {
            await reader.readUInt32(); // complete file size
        }

        if (this.header.version >= 3) {
            await reader.readUInt32(); // file info header size
        }

        reader.position = this.header.size;
    }

    private async createBlocksStream(path: string) {
        const uncompressedSizeSum = this.blocksInfo.reduce((sum, block) => sum + block.uncompressedSize, 0);
        let blockStream: Stream;

        if (uncompressedSizeSum >= Number.MAX_VALUE) {
            blockStream = await FileStream.open(`${path}.temp`, { flags: 'w' });
        } else {
            blockStream = new MemoryStream({ length: uncompressedSizeSum });
        }

        return blockStream;
    }

    private async readBlocksAndDirectory(reader: BinaryReader, blocksStream: Stream) {
        for (const blockInfo of this.blocksInfo) {
            const uncompressedBytes = await reader.readBytes(blockInfo.compressedSize);

            if (blockInfo.flags === 1) {
                // decompress
            }

            await blocksStream.write(Buffer.from(uncompressedBytes));
            blocksStream.position = 0;

            const blocksReader = await new BinaryReader().open(blocksStream);
            const nodesCount = await blocksReader.readInt32();

            this.directoryInfo = [];

            for (let i = 0; i < nodesCount; i++) {
                const path = await blocksReader.readStringToNull();
                const offset = await blocksReader.readUInt32();
                const size = await blocksReader.readUInt32();

                this.directoryInfo[i] = new Node({ path, offset, size });
            }
        }
    }

    private async readFiles(blocksStream: Stream, path: string) {
        this.fileList = [];

        for (let i = 0; i < this.directoryInfo.length; i++) {
            const node = this.directoryInfo[i];
            const file = new StreamFile();

            this.fileList[i] = file;
            file.path = node.path;
            file.fileName = getFileName(node.path);

            if (node.size >= Number.MAX_VALUE) {
                const extractPath = `${path}_unpacked${sep}`;

                file.stream = await FileStream.open(`${extractPath}${file.fileName}`, { flags: 'w' });
            } else {
                file.stream = new MemoryStream({ length: Number(node.size) });
            }

            await blocksStream.seek(Number(node.offset));

            const nodeData = await blocksStream.read(Number(node.size));
            await file.stream.write(nodeData);

            await file.stream.seek(0);
        }
    }

    private async readHeader(reader: BinaryReader) {
        this.header.size = await reader.readInt64();
        this.header.compressedBlocksInfoSize = await reader.readUInt32();
        this.header.uncompressedBlocksInfoSize = await reader.readUInt32();
        this.header.flags = await reader.readUInt32();

        if (this.header.signature !== Signature.FS) {
            await reader.readByte();
        }
    }

    private async readBlocksInfoAndDirectory(reader: BinaryReader) {
        let blocksInfoBytes: number[];

        if (this.header.version >= 7) {
            reader.alignStream(16);
        }

        if ((this.header.flags & 0x80) !== 0) {
            //kArchiveBlocksInfoAtTheEnd
            const position = reader.position;
            reader.position = reader.stream.length - this.header.compressedBlocksInfoSize;
            blocksInfoBytes = await reader.readBytes(this.header.compressedBlocksInfoSize);
            reader.position = position;
        } else {
            //0x40 kArchiveBlocksAndDirectoryInfoCombined
            blocksInfoBytes = await reader.readBytes(this.header.compressedBlocksInfoSize);
        }

        let blocksInfoUncompressedStream: MemoryStream;
        const uncompressedSize = this.header.uncompressedBlocksInfoSize;

        switch (
            this.header.flags & 0x3f //kArchiveCompressionTypeMask
        ) {
            default: // None
            {
                blocksInfoUncompressedStream = new MemoryStream({ data: Buffer.from(blocksInfoBytes) });
                break;
            }
            case 1: {
                // LZMA
                blocksInfoUncompressedStream = new MemoryStream({ length: uncompressedSize });
                // decompress
                await blocksInfoUncompressedStream.seek(0);
                break;
            }
            case 2: // LZ4
            case 3: {
                // LZ4HC
                const uncompressedBytes = Buffer.alloc(uncompressedSize);
                const uncompresed = decodeBlock(Buffer.from(blocksInfoBytes), uncompressedBytes);

                if (uncompresed !== uncompressedSize) {
                    throw new Error(
                        `Lz4 decompression error, wrote ${uncompresed} bytes but expected ${uncompressedSize} bytes.`
                    );
                }

                blocksInfoUncompressedStream = new MemoryStream({ data: uncompressedBytes });
                break;
            }
        }

        const blocksInfoReader = await new BinaryReader().open(blocksInfoUncompressedStream);

        try {
            await blocksInfoReader.readBytes(16); // uncompressedDataHash
            const blocksInfoCount = await blocksInfoReader.readInt32();

            this.blocksInfo = [];

            for (let i = 0; i < blocksInfoCount; i++) {
                const uncompressedSize = await blocksInfoReader.readUInt32();
                const compressedSize = await blocksInfoReader.readUInt32();
                const flags = await blocksInfoReader.readUInt16();

                this.blocksInfo[i] = new StorageBlock({ uncompressedSize, compressedSize, flags });
            }

            const nodesCount = await blocksInfoReader.readInt32();
            this.directoryInfo = [];

            for (let i = 0; i < nodesCount; i++) {
                const offset = await blocksInfoReader.readInt64();
                const size = await blocksInfoReader.readInt64();
                const flags = await blocksInfoReader.readUInt32();
                const path = await blocksInfoReader.readStringToNull();

                this.directoryInfo[i] = new Node({ offset, size, flags, path });
            }
        } finally {
            await blocksInfoReader.close();
        }
    }

    private async readBlocks(reader: BinaryReader, blocksStream: Stream) {
        for (const blockInfo of this.blocksInfo) {
            switch (
                blockInfo.flags & 0x3f // kStorageBlockCompressionTypeMask
            ) {
                default: // None
                {
                    const blockData = await reader.stream.read(reader.length);
                    await blocksStream.write(blockData);
                    // await pipeline(reader.stream.asNodeStream(), blocksStream.asNodeStream());
                    break;
                }
                case 1: {
                    // LZMA
                    // decompress
                    break;
                }
                case 2: // LZ4
                case 3: {
                    // LZ4HC
                    const compressedSize = blockInfo.compressedSize;
                    const uncompressedSize = blockInfo.uncompressedSize;
                    const compressedBytes = await reader.readBytes(compressedSize);
                    const uncompressedBytes = Buffer.alloc(uncompressedSize);

                    const uncompressed = decodeBlock(Buffer.from(compressedBytes), uncompressedBytes);

                    if (uncompressed != uncompressedSize) {
                        throw new Error(
                            `Lz4 decompression error, wrote ${uncompressed} bytes but expected ${uncompressedSize} bytes.`
                        );
                    }

                    await blocksStream.write(uncompressedBytes);
                    // await pipeline(Readable.from(uncompressedBytes), blocksStream.asNodeStream());

                    break;
                }
            }
        }

        await blocksStream.seek(0);
    }
}
