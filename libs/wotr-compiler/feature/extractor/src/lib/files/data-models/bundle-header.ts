export class Header {
    public signature: string;
    public version: number;
    public unityVersion: string;
    public unityRevision: string;
    public size: number | bigint;
    public compressedBlocksInfoSize: number;
    public uncompressedBlocksInfoSize: number;
    public flags: number;
}
