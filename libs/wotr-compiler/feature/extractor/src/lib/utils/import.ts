import { createReadStream, createWriteStream } from 'fs';
import { join, parse } from 'path';
import { exists, getFiles } from './io';
import { uniq } from 'lodash-es';
import { FileReader } from '../files/file-reader';
import { MemoryStream } from 'ia-stream';
import { createGunzip, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream';

export abstract class Import {
    public static async mergeSplitAssets(path: string, allDirectories = false) {
        const splitFiles = await getFiles(path, '*.split0', allDirectories);

        for (const splitFile of splitFiles) {
            const { dir, name } = parse(splitFile);

            const destFull = join(dir, name);

            if (!(await exists(destFull))) {
                const splitParts = await getFiles(dir, name + '.split*');
                const destStream = createWriteStream(destFull);

                for (let i = 0; i < splitParts.length; i++) {
                    const splitPart = `${destFull}.split${i}`;

                    await new Promise((resolve, reject) => {
                        const sourceStream = createReadStream(splitPart);

                        sourceStream.on('end', resolve);
                        sourceStream.on('error', reject);

                        sourceStream.pipe(destStream, { end: false });
                    });
                }

                destStream.end();
            }
        }
    }

    public static async processSplitFiles(selectFiles: string[]) {
        const splitFiles = uniq(
            selectFiles
                .filter(file => file.includes('.split'))
                .map(file => {
                    const { dir, name } = parse(file);
                    return join(dir, name);
                })
        );

        selectFiles = selectFiles.filter(file => file.includes('.split'));

        for (const file of splitFiles) {
            if (await exists(file)) {
                selectFiles.push(file);
            }
        }

        return uniq(selectFiles);
    }

    public static async decompressGZip(reader: FileReader) {
        const stream = new MemoryStream({ length: reader.length });
        const gzip = createGunzip();

        await new Promise((resolve, reject) => {
            const pipe = pipeline(reader.stream.asNodeStream(), gzip, stream.asNodeStream());

            pipe.on('end', resolve);
            pipe.on('error', reject);
        });

        await stream.seek(0);
        await reader.close();

        return new FileReader(reader.fullPath).open(stream);
    }

    public static async decompressBrotli(reader: FileReader) {
        const stream = new MemoryStream({ length: reader.length });
        const brotli = createBrotliDecompress();

        await new Promise((resolve, reject) => {
            const pipe = pipeline(reader.stream.asNodeStream(), brotli, stream.asNodeStream());

            pipe.on('end', resolve);
            pipe.on('error', reject);
        });

        await stream.seek(0);
        await reader.close();

        return new FileReader(reader.fullPath).open(stream);
    }
}
