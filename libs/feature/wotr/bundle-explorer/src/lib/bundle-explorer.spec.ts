import { asMock, MemoryReadStream, MemoryWriteStream } from '@myth-tools/utils/testing/node';
import { fdir } from 'fdir';
import { createReadStream, createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { mocked } from 'jest-mock';
import { kebabCase } from 'lodash';
import { sep } from 'path';
import { BundleExplorer } from './bundle-explorer';
import { Directory } from './models/directory';
import { fdirMock } from './testing/fdir.mock';

jest.mock('fs/promises');
jest.mock('fs');
jest.mock('fdir');

describe('BundleExplorer', () => {
    mocked(unlink).mockImplementation(() => Promise.resolve());

    const sut = new BundleExplorer();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(sut).toBeDefined();
    });

    it('should compile entities into explorer.json', async () => {
        const extractToFolderPath = 'output';
        const entity = '{ "test": "12" }';

        const fdirResponse = jest.fn();
        const FdirMock = fdirMock(fdirResponse);

        const mockWriteStream = new MemoryWriteStream();

        mocked(unlink).mockImplementation(() => Promise.resolve());
        mocked(createWriteStream).mockReturnValue(mockWriteStream);
        mocked(createReadStream).mockImplementation(() => new MemoryReadStream(entity));

        mocked(asMock<typeof FdirMock>(fdir)).mockReturnValue(new FdirMock());

        fdirResponse.mockReturnValue([
            { dir: path('a'), files: [path('a/a.jbp'), path('a/b.jbp')] },
            { dir: path('a/b'), files: [path('a/b/a.jbp')] },
            { dir: path('b'), files: [path('b/a.jbp'), path('b/b.jbp')] },
            { dir: path('c'), files: [] },
            {
                dir: path(`${extractToFolderPath}`),
                files: [path(`${extractToFolderPath}/a.jbp`), path(`${extractToFolderPath}/b.jbp`)]
            }
        ]);

        const expected = await sut['getDirectories'](extractToFolderPath);

        jest.clearAllMocks();

        await sut.execute({ extractToFolderPath, outputFilePath: 'assets', outputFileName: 'explorer.json' });

        expect(unlink).toHaveBeenCalled();
        expect(mockWriteStream.buffer).toBe(
            `[${expected.map(directory => toOutput(directory, entity, extractToFolderPath)).join(',')}]`
        );
    });

    it('should still execute even if cleaning fails', async () => {
        const extractToFolderPath = 'output';
        const entity = '{ "test": "12" }';

        const fdirResponse = jest.fn();
        const FdirMock = fdirMock(fdirResponse);

        const mockWriteStream = new MemoryWriteStream();

        mocked(unlink).mockImplementation(() => Promise.reject());
        mocked(createWriteStream).mockReturnValue(mockWriteStream);
        mocked(createReadStream).mockImplementation(() => new MemoryReadStream(entity));

        mocked(asMock<typeof FdirMock>(fdir)).mockReturnValue(new FdirMock());

        fdirResponse.mockReturnValue([
            { dir: path('a'), files: [path('a/a.jbp'), path('a/b.jbp')] },
            { dir: path('a/b'), files: [path('a/b/a.jbp')] },
            { dir: path('b'), files: [path('b/a.jbp'), path('b/b.jbp')] },
            { dir: path('c'), files: [] },
            {
                dir: path(`${extractToFolderPath}`),
                files: [path(`${extractToFolderPath}/a.jbp`), path(`${extractToFolderPath}/b.jbp`)]
            }
        ]);

        const expected = await sut['getDirectories'](extractToFolderPath);

        jest.clearAllMocks();

        await sut.execute({ extractToFolderPath, outputFilePath: 'assets', outputFileName: 'explorer.json' });

        expect(unlink).toHaveBeenCalled();
        expect(mockWriteStream.buffer).toBe(
            `[${expected.map(directory => toOutput(directory, entity, extractToFolderPath)).join(',')}]`
        );
    });

    function path(path: string) {
        return path.split('/').join(sep);
    }

    function toOutput(directory: Directory, entity: string, extractToFolderPath: string) {
        const files = directory.files
            .map(file => {
                const paths = file
                    .replace(`${extractToFolderPath}${sep}`, '')
                    .split(sep)
                    .map(kebabCase)
                    .map(str => `"${str.replace('-jbp', '.jbp')}"`)
                    .join(', ');

                return `{"p":[${paths}],"e":${entity}}`;
            })
            .join(',');

        const directores = directory.directories
            .map(directory => toOutput(directory, entity, extractToFolderPath))
            .join(',');

        return `{"n":"${directory.name}","f":[${files}],"d":[${directores}]}`;
    }
});
