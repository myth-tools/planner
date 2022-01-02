import { EndianType } from '../data-models/endian-type';
import { BitConverter } from './bit-converter';
import { Stream } from 'ia-stream';

/** NodeJS Implementation of C# BinaryReader which supports big endian. */
export class BinaryReader {
    public stream: Stream;

    private _position = 0;
    private buffer = Buffer.alloc(0);

    public get length() {
        return this.stream.length;
    }

    public get position() {
        return this._position;
    }

    public set position(value: number) {
        this._position = Math.max(0, Math.min(this.length, value));
    }

    public get isEndOfStream(): boolean {
        return this._position >= this.length;
    }

    constructor(public readonly endian = EndianType.BigEndian) {}

    public async open(stream: Stream) {
        this.stream = stream;
        return this;
    }

    public async readInt16() {
        await this.read(2);

        return this.endian === EndianType.BigEndian ? this.buffer.readInt16BE() : this.buffer.readInt16LE();
    }

    public async readInt32() {
        await this.read(4);

        return this.endian === EndianType.BigEndian ? this.buffer.readInt32BE() : this.buffer.readInt32LE();
    }

    public async readInt64() {
        await this.read(8);

        return this.endian === EndianType.BigEndian ? this.buffer.readBigInt64BE() : this.buffer.readBigInt64LE();
    }

    public async readUInt16() {
        await this.read(2);

        return this.endian === EndianType.BigEndian ? this.buffer.readUInt16BE() : this.buffer.readUInt16LE();
    }

    public async readUInt32() {
        await this.read(4);

        return this.endian === EndianType.BigEndian ? this.buffer.readUInt32BE() : this.buffer.readUInt32LE();
    }

    public async readUInt64() {
        await this.read(8);

        return this.endian === EndianType.BigEndian ? this.buffer.readBigUInt64BE() : this.buffer.readBigUInt64LE();
    }

    public async readSingle() {
        await this.read(4);

        if (this.endian === EndianType.BigEndian) {
            this.buffer.set(this.buffer.subarray(0, 4).reverse(), 0);
        }

        return BitConverter.toSingle(this.buffer, 0);
    }

    public async readDouble() {
        await this.read(8);

        if (this.endian === EndianType.BigEndian) {
            this.buffer.reverse();
        }

        return BitConverter.toDouble(this.buffer, 0);
    }

    public async readByte() {
        await this.read(1);

        return this.buffer[0];
    }

    public async readBytes(bytesToRead: number) {
        await this.read(bytesToRead);

        const bytes: number[] = [];

        for (let i = 0; i < bytesToRead; i++) {
            bytes[i] = this.buffer[i];
        }

        return bytes;
    }

    public async readStringToNull(maxLength = 32767) {
        const bytes: number[] = [];
        let count = 0;

        while (this.position !== this.length && count < maxLength) {
            const b = await this.readByte();

            if (b === 0) {
                break;
            }

            bytes.push(b);
            count++;
        }

        return Buffer.from(bytes).toString('utf8');
    }

    public alignStream(alignment: number) {
        const position = this.stream.position;
        const mod = position % alignment;

        if (mod !== 0) {
            this.position += alignment - mod;
        }
    }

    public async close() {
        await this.stream.close();
    }

    private async read(bytesToRead: number) {
        if (!this.stream) {
            throw new Error(`Reader is not open yet.`);
        }

        const buffer = await this.stream.readFrom(this.position, bytesToRead);

        this.buffer = buffer;
        this.position += buffer.byteLength;
    }
}
