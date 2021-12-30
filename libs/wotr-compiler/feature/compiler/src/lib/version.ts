import { Options } from '../data-models/options';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { VersionInfo } from '../data-models/version-info';

export class Version {
    constructor(private readonly options: Options) {}

    public async extract() {
        const versionInfo = await this.get(this.options.root, this.options.file);

        return this.update(this.options.output, versionInfo);
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
