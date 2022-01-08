import { VersionInfo } from './version-info';

describe('VersionInfo', () => {
    it('should be defined', () => {
        expect(new VersionInfo('')).toBeDefined();
    });

    it('should output properties as expected', () => {
        const { date, hash, version } = new VersionInfo(
            '2021-Dec-22 14:51 34f0951707d3c52b611428f8db5b4710080c8b45 1.1.6e'
        );

        expect(date).toEqual(new Date('2021-Dec-22 14:51 UTC'));
        expect(hash).toBe('34f0951707d3c52b611428f8db5b4710080c8b45');
        expect(version).toBe('1.1.6e');
    });
});
