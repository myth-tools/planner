import { Entity } from './entity';

export interface Blueprint {
    name: string;
    blueprints: Blueprint[];
}

export interface BlueprintResponse {
    name: string;
    blueprints: BlueprintResponse[];
    entities: Entity[];
    isExpanded: boolean;
}
