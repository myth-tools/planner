import { exists } from '@myth-tools/node/utils/file-system';
import { createReadStream } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { mocked } from 'jest-mock';
import { async, ZipEntry } from 'node-stream-zip';
import { Extract } from './extract';

jest.mock('fs/promises');
jest.mock('node-stream-zip');
jest.mock('@myth-tools/node/utils/file-system');

type Entry = { [name: string]: ZipEntry };

describe('Extract', () => {
    mocked(rm).mockImplementation(() => Promise.resolve());
    mocked(mkdir).mockImplementation(() => Promise.resolve(''));

    const Zip = mocked(async);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(new Extract()).toBeDefined();
    });

    it('should extract files', async () => {
        mocked(exists).mockImplementation(() => Promise.resolve(false));
        const { entries, extract, close } = setupZipMock();
        const sut = new Extract();

        await sut.execute({ gameDirectory: '', zipFileName: '', extractToFolderPath: '' });

        expect(rm).toHaveBeenCalled();
        expect(entries).toHaveBeenCalledTimes(1);
        expect(extract).toHaveBeenCalledTimes(3);
        expect(extract.mock.results[0].value).resolves.toBe(undefined);
        expect(extract.mock.results[1].value).resolves.toBe(3);
        expect(extract.mock.results[2].value).resolves.toBe(2);
        expect(close).toHaveBeenCalledTimes(1);
    });

    it('should skip extract if already extracted', async () => {
        mocked(exists).mockImplementation(() => Promise.resolve(true));
        const { entries, extract, close } = setupZipMock();
        const sut = new Extract();

        await sut.execute({ gameDirectory: '', zipFileName: '', extractToFolderPath: '', force: false });

        expect(rm).not.toHaveBeenCalled();
        expect(entries).not.toHaveBeenCalled();
        expect(extract).not.toHaveBeenCalled();
        expect(close).not.toHaveBeenCalled();
    });

    function setupZipMock() {
        const entryData: Entry = {
            'Class/': createZipEntry({ name: 'Class/', isDirectory: true }),
            'Class/1': createZipEntry({ name: 'Class/1', isDirectory: true }),
            'Class/1/test.txt': createZipEntry({ name: 'Class/1/test.txt', isDirectory: false }),
            'Ability/': createZipEntry({ name: 'Ability/', isDirectory: true }),
            'Ability/test1.txt': createZipEntry({ name: 'Ability/test.txt', isDirectory: false }),
            'test2.txt': createZipEntry({ name: 'test2.txt', isDirectory: false }),
            'World/': createZipEntry({ name: 'World/', isDirectory: true }),
            'World/2': createZipEntry({ name: 'World/2', isDirectory: true }),
            'World/1/test.txt': createZipEntry({ name: 'World/1/test.txt', isDirectory: false })
        };

        const entries = jest.fn().mockImplementation(async () => entryData);
        const extract = jest.fn().mockImplementation(async (name: string) => {
            const entries = Object.values(entryData);
            const extracted = entries.filter(entry => entry.name.includes(name));

            // Files return undefined instead of a number.
            if (extracted.length === 1) {
                return extracted[0].isFile ? undefined : 1;
            }

            return extracted.length;
        });
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
