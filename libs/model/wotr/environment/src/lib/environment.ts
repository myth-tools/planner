export interface Environment {
    production: boolean;
    release: string;
    game: Game;
    firebase: Firebase;
    version: VersionInfo;
    blueprints: Blueprints;
}

export interface Game {
    directory: string;
    date: string;
    hash: string;
    version: string;
}

export interface Firebase {
    apiKey: string;
    prefix: string;
    domain: string;
}

export interface VersionInfo {
    infoFilePath: string;
    outputFilePath: string;
}

export interface Blueprints {
    zipFileName: string;
    extractToFolderPath: string;
    outputFilePath: string;
    outputFileName: string;
}
