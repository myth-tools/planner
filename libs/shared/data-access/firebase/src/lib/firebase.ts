import { DynamicLinkRequest, DynamicLinkResponse } from '../data-models/dynamic-link';
import { Options } from '../data-models/options';

export class Firebase {
    private readonly url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${this.options.apiKey}`;

    constructor(private readonly options: Options) {}

    /** Uses Google Dynamic Links to create a short url for the link. */
    public async createDynamicLink(link: string): Promise<DynamicLinkResponse> {
        const data: DynamicLinkRequest = {
            dynamicLinkInfo: {
                link,
                domainUriPrefix: this.options.prefix
            },
            suffix: { option: this.options.suffix }
        };

        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
}
