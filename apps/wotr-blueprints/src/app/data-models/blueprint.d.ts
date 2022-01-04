import { Entity } from './entity';

export interface Blueprint {
    name: string;
    children: Blueprint[];
}

export interface BlueprintResponse {
    name: string;
    children: BlueprintResponse[];
    entities: Entity[];
    isExpanded: boolean;
}
