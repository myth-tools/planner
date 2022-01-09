import { Writable } from 'stream';

export class MemoryWriteStream extends Writable {
    public path = '';
    public buffer = '';
    public bytesWritten = this.buffer.length;
    public pending = false;

    public _construct(callback: (error?: Error) => void): void {
        this.emit('open');
        callback();
    }

    public _write(chunk: unknown, _: unknown, next: () => void) {
        this.buffer += chunk;
        next();
    }

    public _destroy(error: Error, callback: (error?: Error) => void): void {
        this.emit('end');
        callback();
    }

    public reset() {
        this.buffer = '';
    }

    public close() {
        this.destroy();
    }
}
