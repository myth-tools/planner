import { File } from './file';

export interface Blueprint {
    n: string;
    f: File[];
    d: Blueprint[];
}
