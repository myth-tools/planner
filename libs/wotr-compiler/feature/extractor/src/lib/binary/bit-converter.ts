import { endianness } from 'os';
import { EndianType } from '../data-models/endian-type';

/** NodeJS implementation of C# BitConverter */
export abstract class BitConverter {
    public static isLittleEndian() {
        return endianness() === EndianType.LittleEndian;
    }

    public static toInt32(source: Buffer, startIndex: number): number {
        if (startIndex >= source.byteLength) {
            throw new Error('');
        }

        if (startIndex > source.byteLength - 4) {
            throw new Error('');
        }

        if (startIndex % 4 === 0) {
            // Data is aligned
            return source[startIndex];
        } else {
            if (this.isLittleEndian()) {
                return (
                    source[startIndex] |
                    (source[startIndex + 1] << 8) |
                    (source[startIndex + 2] << 16) |
                    (source[startIndex + 3] << 32)
                );
            } else {
                return (
                    (source[startIndex] << 24) |
                    (source[startIndex + 1] << 16) |
                    (source[startIndex + 2] << 8) |
                    source[startIndex + 3]
                );
            }
        }
    }

    public static toInt64(source: Buffer, startIndex: number): number {
        if (startIndex >= source.byteLength) {
            throw new Error('');
        }

        if (startIndex > source.byteLength - 8) {
            throw new Error('');
        }

        if (startIndex % 8 == 0) {
            // Data is aligned
            return source[startIndex];
        } else {
            if (this.isLittleEndian()) {
                const i1 =
                    source[startIndex] |
                    (source[startIndex + 1] << 8) |
                    (source[startIndex + 2] << 16) |
                    (source[startIndex + 3] << 24);
                const i2 =
                    (source[startIndex + 4] << 24) |
                    (source[startIndex + 5] << 8) |
                    (source[startIndex + 6] << 16) |
                    (source[startIndex + 7] << 24);

                return i1 | (i2 << 32);
            } else {
                const i1 =
                    (source[startIndex] << 24) |
                    (source[startIndex + 1] << 16) |
                    (source[startIndex + 2] << 8) |
                    source[startIndex + 3];
                const i2 =
                    (source[startIndex + 4] << 24) |
                    (source[startIndex + 5] << 16) |
                    (source[startIndex + 6] << 8) |
                    source[startIndex + 7];

                return i2 | (i1 << 32);
            }
        }
    }

    public static toSingle(source: Buffer, startIndex: number): number {
        if (startIndex >= source.byteLength) {
            throw new Error('');
        }

        if (startIndex > source.byteLength - 4) {
            throw new Error('');
        }

        return this.toInt32(source, startIndex);
    }

    public static toDouble(source: Buffer, startIndex: number): number {
        if (startIndex >= source.byteLength) {
            throw new Error('');
        }

        if (startIndex > source.byteLength - 8) {
            throw new Error('');
        }

        return this.toInt64(source, startIndex);
    }
}
