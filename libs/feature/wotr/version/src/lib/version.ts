import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Options } from './models/options';
import { VersionInfo } from './models/version-info';

export class Version {
    public async execute({ gameDirectory, infoFilePath, outputFilePath }: Options) {
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

        if (!this.isOutOfDate(environment, versionInfo)) {
            console.log(`Version is up to date. Skipping...`);
            return false;
        }

        const result = environment
            .replace(/date: '.+'/g, `date: '${versionInfo.date.toISOString()}'`)
            .replace(/hash: '.+'/g, `hash: '${versionInfo.hash}'`)
            .replace(/version: '.+'/, `version: '${versionInfo.version}'`);

        await writeFile(output, result, 'utf-8');

        return true;
    }

    private isOutOfDate(environment: string, versionInfo: VersionInfo) {
        const date = environment.match(/date: '.+'/g);
        const hash = environment.match(/hash: '.+'/g);
        const version = environment.match(/version: '.+'/);

        if (`date: '${versionInfo.date.toISOString()}'` !== date[0]) {
            return true;
        }

        if (`hash: '${versionInfo.hash}'` !== hash[0]) {
            return true;
        }

        if (`version: '${versionInfo.version}'` !== version[0]) {
            return true;
        }

        return false;
    }
}
