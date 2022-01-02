export interface StorageBlockArgs {
    compressedSize: number;
    uncompressedSize: number;
    flags: number;
}

export class StorageBlock {
    public compressedSize: number;
    public uncompressedSize: number;
    public flags: number;

    constructor({ compressedSize, uncompressedSize, flags }: StorageBlockArgs) {
        this.compressedSize = compressedSize;
        this.uncompressedSize = uncompressedSize;
        this.flags = flags;
    }
}
