import { Version } from './version';
import { readFile, writeFile } from 'fs/promises';
import { mocked } from 'jest-mock';
import { join } from 'path';

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
    it('should be defined', () => {
        expect(new Version()).toBeDefined();
    });

    it('should get version info', async () => {
        const gameDirectory = 'test/';
        const versionInfoFile = 'version.info';
        const outputFile = 'environment.ts';

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
            join(gameDirectory, versionInfoFile),
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );
        fileMap.set('environment.ts', getEnvironmentString(environment.date, environment.hash, environment.version));

        await version.execute({ gameDirectory, versionInfoFile, outputFile });

        expect(readFileMock).toHaveBeenCalledTimes(2);
        expect(readFileMock.mock.calls[0]).toEqual([join(gameDirectory, versionInfoFile), 'utf-8']);
        expect(readFileMock.mock.calls[1]).toEqual([outputFile, 'utf-8']);

        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock).toHaveBeenCalledWith(
            outputFile,
            getEnvironmentString(expected.date, expected.hash, expected.version),
            'utf-8'
        );
    });

    function getEnvironmentString(date: string, hash: string, version: string) {
        return `'export const environment = {\r\n    production: true,\r\n    release: '0.0.0-development',\r\n    game: {\r\n        date: '${date}',\r\n        hash: '${hash}',\r\n        version: '${version}'\r\n    },\r\n    firebase: {\r\n        apiKey: 'AIzaSyCRsh4TCiKBZ9tFH6rJaJ_OdZt-3ckcbHI',\r\n        prefix: 'short-url.myth-tools.com',\r\n        domain: 'wotr.myth-tools.com'\r\n    }\r\n};\r\n'`;
    }
});
