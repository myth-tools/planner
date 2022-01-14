import { BlueprintWithId } from './explorer';

export interface BlueprintEvent {
    isExpanded: boolean;
    nestedLevel: number;
    index: number;
    blueprint: BlueprintWithId;
}
