export interface CompileOptions {
    extractFolder: string;
    compileFolder: string;
    indexFileName: string;
}

export interface ExtractOptions {
    gameDirectory: string;
    zipFile: string;
    extractFolder: string;
}

export interface VersionOptions {
    gameDirectory: string;
    versionInfoFile: string;
    outputFile: string;
}
