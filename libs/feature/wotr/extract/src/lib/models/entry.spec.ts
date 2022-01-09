import { sep } from 'path';
import { Entry } from './entry';

describe('Entry', () => {
    it('should be defined', () => {
        expect(new Entry('/test/path')).toBeDefined();
    });

    it('should output properties as expected', () => {
        const directory = new Entry('/test/path/');

        expect(directory.isRoot).toBe(false);
        expect(directory.base).toBe('test');
        expect(directory.name).toBe(`${sep}test${sep}path`);
    });
});
