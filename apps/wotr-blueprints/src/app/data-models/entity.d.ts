export interface Entity {
    AssetId: string;
}

export interface EntitySource {
    file: string;
    entity: Entity;
}

export interface EntityHash {
    entity: EntitySource;
    name: string;
}
