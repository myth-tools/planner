import { DynamicLinkInfo, DynamicLinkSuffix } from './dynamic-link-info';

export interface DynamicLinkRequest {
    dynamicLinkInfo: DynamicLinkInfo;
    suffix: DynamicLinkSuffix;
}
