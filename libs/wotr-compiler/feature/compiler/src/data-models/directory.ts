import { normalize, sep } from 'path';

export class Directory {
    public readonly name: string;
    public readonly base: string;
    public readonly isRoot: boolean;

    private readonly parts: string[];

    constructor(name: string) {
        name = normalize(name);

        this.name = this.stripTrailingSlash(name);
        this.parts = this.getParts(this.name);
        this.base = this.parts[0];
        this.isRoot = this.parts.length === 1;
    }

    private stripTrailingSlash(fileName: string) {
        return fileName.endsWith(sep) ? fileName.slice(0, fileName.length - 1) : fileName;
    }

    private getParts(fileName: string) {
        return fileName.split(sep).filter(Boolean);
    }
}
