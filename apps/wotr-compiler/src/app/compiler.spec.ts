import { Compiler } from './compiler';
import { Compile, Extract, Version } from '@myth-tools/wotr-compiler/feature/compiler';
import { mocked } from 'jest-mock';

jest.mock('@myth-tools/wotr-compiler/feature/compiler');

const compileMock = mocked(Compile);
const extractMock = mocked(Extract);
const versionMock = mocked(Version);

describe('Compiler', () => {
    beforeEach(() => {
        compileMock.mockClear();
        extractMock.mockClear();
        versionMock.mockClear();
    });

    it('should be defined', () => {
        expect(new Compiler()).toBeDefined();
    });

    it('should run execute commands', async () => {
        expect(compileMock).not.toHaveBeenCalled();
        expect(extractMock).not.toHaveBeenCalled();
        expect(versionMock).not.toHaveBeenCalled();

        const compiler = new Compiler();

        await compiler.execute();

        expect(compileMock).toHaveBeenCalledTimes(1);
        expect(extractMock).toHaveBeenCalledTimes(1);
        expect(versionMock).toHaveBeenCalledTimes(1);

        expect(compileMock.mock.instances[0].execute).toHaveBeenCalledTimes(1);
        expect(extractMock.mock.instances[0].execute).toHaveBeenCalledTimes(1);
        expect(versionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1);
    });
});
