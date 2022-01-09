import { Readable } from 'stream';

export class MemoryReadStream extends Readable {
    public path = '';
    public pending = false;
    public bytesRead = this.content.length;

    constructor(private readonly content: string) {
        super();
    }

    public _read(): void {
        this.push(this.content);
        this.push(null);
    }

    public _destroy(error: Error, callback: (error?: Error) => void): void {
        this.emit('end');
        callback();
    }

    public close() {
        this.destroy();
    }
}
