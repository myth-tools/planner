import { createReadStream } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { mocked } from 'jest-mock';
import { async, ZipEntry } from 'node-stream-zip';
import { Blueprints } from './blueprints';

jest.mock('fs/promises');
jest.mock('node-stream-zip');

mocked(rm).mockImplementation(() => Promise.resolve());
mocked(mkdir).mockImplementation(() => Promise.resolve(''));

const Zip = mocked(async);

type Entry = { [name: string]: ZipEntry };

describe('Blueprints', () => {
    it('should be defined', () => {
        expect(new Blueprints({ root: '', file: '', output: '' })).toBeDefined();
    });

    it('should clean directory', async () => {
        const blueprints = new Blueprints({ root: 'test/', file: '', output: 'output' });

        await blueprints.clean();

        expect(rm).toHaveBeenCalled();
    });

    it('should extract files', async () => {
        const { entries, extract, close } = setupZipMock();
        const blueprints = new Blueprints({ root: 'test/', file: '', output: 'output' });

        await blueprints.extract(['Class']);

        expect(entries).toHaveBeenCalledTimes(1);
        expect(extract).toHaveBeenCalledTimes(1);
        expect(close).toHaveBeenCalledTimes(1);
    });

    it('should extract multiple folders', async () => {
        const { entries, extract, close } = setupZipMock();
        const blueprints = new Blueprints({ root: 'test/', file: '', output: 'output' });

        await blueprints.extract(['Class', 'Ability']);

        expect(entries).toHaveBeenCalledTimes(1);
        expect(extract).toHaveBeenCalledTimes(2);
        expect(close).toHaveBeenCalledTimes(1);
    });

    function setupZipMock() {
        const entryData: Entry = {
            'Class/': createZipEntry({ name: 'Class/', isDirectory: true }),
            'Class/1': createZipEntry({ name: 'Class/1', isDirectory: true }),
            'Class/1/test.txt': createZipEntry({ name: 'Class/1/test.txt', isDirectory: false }),
            'Ability/': createZipEntry({ name: 'Ability/', isDirectory: true }),
            'Ability/test1.txt': createZipEntry({ name: 'Ability/test.txt', isDirectory: false }),
            'test2.txt': createZipEntry({ name: 'test2.txt', isDirectory: false })
        };

        const entries = jest.fn().mockImplementation(async () => entryData);
        const extract = jest.fn().mockImplementation(async () => 1);
        const close = jest.fn().mockImplementation(() => Promise.resolve());

        Zip.mockImplementation(() => {
            return {
                entriesCount: Promise.resolve(1),
                comment: Promise.resolve(''),
                entry: () => Promise.resolve(<ZipEntry>{}),
                entryData: () => Promise.resolve(Buffer.from('')),
                stream: async () => createReadStream(''),
                on: () => {
                    return;
                },
                entries,
                extract,
                close
            };
        });

        return { entries, extract, close };
    }

    function createZipEntry({ name, isDirectory }: { name: string; isDirectory: boolean }) {
        const entry: ZipEntry = {
            name,
            isDirectory,
            isFile: !isDirectory,
            comment: '',
            encrypted: false,
            verMade: 1,
            version: 1,
            flags: 1,
            method: 1,
            time: 1,
            crc: 1,
            compressedSize: 1,
            size: 1,
            diskStart: 1,
            inattr: 1,
            attr: 1,
            offset: 1
        };

        return entry;
    }
});
