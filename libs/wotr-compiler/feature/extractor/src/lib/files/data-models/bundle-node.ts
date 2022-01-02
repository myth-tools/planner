export interface NodeArgs {
    path: string;
    offset: number | bigint;
    size: number | bigint;
    flags?: number;
}

export class Node {
    public path: string;
    public offset: number | bigint;
    public size: number | bigint;
    public flags?: number;

    constructor({ offset, size, flags, path }: NodeArgs) {
        this.path = path;
        this.offset = offset;
        this.size = size;
        this.flags = flags;
    }
}
