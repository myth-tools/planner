import { EntitySource } from './entity';

export interface Blueprint {
    name: string;
    blueprints: Blueprint[];
}

export interface BlueprintResponse {
    name: string;
    blueprints: BlueprintResponse[];
    entities: EntitySource[];
    isExpanded: boolean;
}
