import { File } from './file';

export interface ExplorerItem {
    nestedLevel: number;
    item: BlueprintWithId | FileWithId;
}

export interface BlueprintWithId {
    id: number;
    n: string;
    d: BlueprintWithId[];
    f: FileWithId[];
}

export interface FileWithId extends File {
    id: number;
}
