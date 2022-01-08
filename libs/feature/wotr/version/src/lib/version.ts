import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { VersionOptions } from './models/options';
import { VersionInfo } from './models/version-info';

export class Version {
    public async execute({ gameDirectory, infoFilePath, outputFilePath }: VersionOptions) {
        const versionInfo = await this.get(gameDirectory, infoFilePath);

        return this.update(outputFilePath, versionInfo);
    }

    private async get(root: string, file: string) {
        const fileName = join(root, file);

        const contents = await readFile(fileName, 'utf-8');

        return new VersionInfo(contents);
    }

    private async update(output: string, versionInfo: VersionInfo) {
        const environment = await readFile(output, 'utf-8');

        const result = environment
            .replace(/date: '.+'/g, `date: '${versionInfo.date.toISOString()}'`)
            .replace(/hash: '.+'/g, `hash: '${versionInfo.hash}'`)
            .replace(/version: '.+'/, `version: '${versionInfo.version}'`);

        await writeFile(output, result, 'utf-8');
    }
}
