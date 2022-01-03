import { ReadStream, WriteStream } from 'fs';

export class WriteStreamEx {
    private readonly open = new Promise<void>(resolve => this.stream.once('open', resolve));
    private error: Error;

    constructor(private readonly stream: WriteStream) {
        this.stream.once('error', error => (this.error = error));
    }

    public async copyFrom(source: ReadStream) {
        if (this.error) {
            return Promise.reject(this.error);
        }

        await this.open;

        return new Promise<void>((resolve, reject) => {
            source.once('error', reject);
            source.once('end', resolve);

            source.pipe(this.stream, { end: false });
        });
    }

    public async write(chunk: unknown) {
        if (this.error) {
            return Promise.reject(this.error);
        }

        await this.open;

        return new Promise<void>((resolve, reject) => {
            this.stream.write(chunk, error => {
                if (error) {
                    this.error = error;
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    public async end() {
        return new Promise<void>(resolve => this.stream.end(resolve));
    }
}
