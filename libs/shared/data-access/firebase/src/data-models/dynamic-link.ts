export type Suffix = 'SHORT' | 'UNGUESSABLE';

interface DynamicLinkInfo {
    /** Short URL */
    domainUriPrefix: string;
    /** Long URL to shrink */
    link: string;
}

interface DynamicLinkSuffix {
    option?: Suffix;
}

export interface DynamicLinkRequest {
    dynamicLinkInfo: DynamicLinkInfo;
    suffix: DynamicLinkSuffix;
}

export interface DynamicLinkResponse {
    previewLink: string;
    shortLink: string;
}
