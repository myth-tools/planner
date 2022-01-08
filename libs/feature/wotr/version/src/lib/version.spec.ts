import { featureWotrVersion } from './version';

describe('featureWotrVersion', () => {
    it('should work', () => {
        expect(featureWotrVersion()).toEqual('feature-wotr-version');
    });
});
