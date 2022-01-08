export type Suffix = 'SHORT' | 'UNGUESSABLE';

export interface DynamicLinkInfo {
    /** Short URL */
    domainUriPrefix: string;
    /** Long URL to shrink */
    link: string;
}

export interface DynamicLinkSuffix {
    option?: Suffix;
}
