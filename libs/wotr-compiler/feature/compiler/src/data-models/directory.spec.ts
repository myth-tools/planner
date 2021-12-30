import { sep } from 'path';
import { Directory } from './directory';

describe('Directory', () => {
    it('should be defined', () => {
        expect(new Directory('/test/path')).toBeDefined();
    });

    it('should output properties as expected', () => {
        const directory = new Directory('/test/path/');

        expect(directory.isRoot).toBe(false);
        expect(directory.base).toBe('test');
        expect(directory.name).toBe(`${sep}test${sep}path`);
    });
});
