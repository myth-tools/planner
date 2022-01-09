export interface Entity {
    AssetId: string;
    Data: Data;
    Meta?: Meta;
}

export interface Data {
    $type: string;
}

export interface Meta {
    ShadowDeleted: boolean;
}
