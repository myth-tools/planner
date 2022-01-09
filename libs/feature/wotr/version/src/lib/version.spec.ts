import { readFile, writeFile } from 'fs/promises';
import { mocked } from 'jest-mock';
import { join } from 'path';
import { Version } from './version';

jest.mock('fs/promises');

const fileMap = new Map<string, string>();

const writeFileMock = mocked(writeFile).mockImplementation(() => Promise.resolve());
const readFileMock = mocked(readFile).mockImplementation(async (fileName: string) => {
    const mock = fileMap.get(fileName);

    if (!mock) {
        throw new Error(`Unable to locate a mock for: ${fileName}`);
    }

    return mock;
});

describe('Version', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(new Version()).toBeDefined();
    });

    it('should get version info', async () => {
        const gameDirectory = 'test/';
        const infoFilePath = 'version.info';
        const outputFilePath = 'environment.ts';

        const environment = {
            date: '1899-12-31T00:00:00.000Z',
            hash: '00000000000000000000000000000000',
            version: '0.0.0'
        };

        const expected = {
            date: '2021-12-22T14:51:00.000Z',
            hash: '34f0951707d3c52b611428f8db5b4710080c8b45',
            version: '1.1.6e'
        };

        const version = new Version();

        fileMap.set(
            join(gameDirectory, infoFilePath),
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );
        fileMap.set('environment.ts', getEnvironmentString(environment.date, environment.hash, environment.version));

        await version.execute({ gameDirectory, infoFilePath, outputFilePath });

        expect(readFileMock).toHaveBeenCalledTimes(2);
        expect(readFileMock.mock.calls[0]).toEqual([join(gameDirectory, infoFilePath), 'utf-8']);
        expect(readFileMock.mock.calls[1]).toEqual([outputFilePath, 'utf-8']);

        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
            outputFilePath,
            getEnvironmentString(expected.date, expected.hash, expected.version),
            'utf-8'
        );
    });

    it('should skip update if up to date', async () => {
        const gameDirectory = 'test/';
        const infoFilePath = 'version.info';
        const outputFilePath = 'environment.ts';

        const environment = {
            date: '2021-12-22T14:51:00.000Z',
            hash: '34f0951707d3c52b611428f8db5b4710080c8b45',
            version: '1.1.6e'
        };

        const version = new Version();

        fileMap.set(
            join(gameDirectory, infoFilePath),
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );
        fileMap.set('environment.ts', getEnvironmentString(environment.date, environment.hash, environment.version));

        const outOfDate = await version.execute({ gameDirectory, infoFilePath, outputFilePath });

        expect(readFileMock).toHaveBeenCalledTimes(2);
        expect(readFileMock.mock.calls[0]).toEqual([join(gameDirectory, infoFilePath), 'utf-8']);
        expect(readFileMock.mock.calls[1]).toEqual([outputFilePath, 'utf-8']);

        expect(writeFileMock).not.toHaveBeenCalled();
        expect(outOfDate).toBe(false);
    });

    it('should detect hash out of date', async () => {
        const gameDirectory = 'test/';
        const infoFilePath = 'version.info';
        const outputFilePath = 'environment.ts';

        const environment = {
            date: '2021-12-22T14:51:00.000Z',
            hash: '00000000000000000000000000000000',
            version: '1.1.6e'
        };

        const version = new Version();

        fileMap.set(
            join(gameDirectory, infoFilePath),
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );
        fileMap.set('environment.ts', getEnvironmentString(environment.date, environment.hash, environment.version));

        const outOfDate = await version.execute({ gameDirectory, infoFilePath, outputFilePath });

        expect(readFileMock).toHaveBeenCalledTimes(2);
        expect(readFileMock.mock.calls[0]).toEqual([join(gameDirectory, infoFilePath), 'utf-8']);
        expect(readFileMock.mock.calls[1]).toEqual([outputFilePath, 'utf-8']);

        expect(writeFileMock).toHaveBeenCalled();
        expect(outOfDate).toBe(true);
    });

    it('should detect version out of date', async () => {
        const gameDirectory = 'test/';
        const infoFilePath = 'version.info';
        const outputFilePath = 'environment.ts';

        const environment = {
            date: '2021-12-22T14:51:00.000Z',
            hash: '34f0951707d3c52b611428f8db5b4710080c8b45',
            version: '0.0.0'
        };

        const version = new Version();

        fileMap.set(
            join(gameDirectory, infoFilePath),
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );
        fileMap.set('environment.ts', getEnvironmentString(environment.date, environment.hash, environment.version));

        const outOfDate = await version.execute({ gameDirectory, infoFilePath, outputFilePath });

        expect(readFileMock).toHaveBeenCalledTimes(2);
        expect(readFileMock.mock.calls[0]).toEqual([join(gameDirectory, infoFilePath), 'utf-8']);
        expect(readFileMock.mock.calls[1]).toEqual([outputFilePath, 'utf-8']);

        expect(writeFileMock).toHaveBeenCalled();
        expect(outOfDate).toBe(true);
    });

    function getEnvironmentString(date: string, hash: string, version: string) {
        return `'export const environment = {\r\n    production: true,\r\n    release: '0.0.0-development',\r\n    game: {\r\n        date: '${date}',\r\n        hash: '${hash}',\r\n        version: '${version}'\r\n    },\r\n    firebase: {\r\n        apiKey: 'AIzaSyCRsh4TCiKBZ9tFH6rJaJ_OdZt-3ckcbHI',\r\n        prefix: 'short-url.myth-tools.com',\r\n        domain: 'wotr.myth-tools.com'\r\n    }\r\n};\r\n'`;
    }
});
