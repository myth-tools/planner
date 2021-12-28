import { DynamicLinkRequest } from '../data-models/dynamic-link';
import { Firebase } from './firebase';

describe('Firebase', () => {
    it('should be defined', () => {
        expect(new Firebase({ apiKey: '123', prefix: 'prefix.com' })).toBeDefined();
    });

    it('should create dynamic url', async () => {
        const apiKey = '123';
        const prefix = 'short-url';
        const link = 'long-link';
        const firebase = new Firebase({ apiKey, prefix });

        const expected: DynamicLinkRequest = {
            dynamicLinkInfo: {
                link,
                domainUriPrefix: prefix
            },
            suffix: {}
        };

        const fetchMock = jest
            .spyOn(global, 'fetch')
            .mockImplementation(async () => <Response>{ json: async () => ({ shortLink: `${prefix}/123` }) });

        const { shortLink } = await firebase.createDynamicLink(link);

        expect(fetchMock).toHaveBeenCalledWith(
            `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
            expect.objectContaining({ body: JSON.stringify(expected) })
        );
        expect(shortLink).toBe(`${prefix}/123`);
    });
});
