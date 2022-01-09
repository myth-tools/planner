import { Extract } from '@myth-tools/feature/wotr/extract';
import { Version } from '@myth-tools/feature/wotr/version';
import { environment } from '@myth-tools/utils/wotr/environment/node';

export class Bundler {
    private readonly version = new Version();
    private readonly extract = new Extract();

    public async execute() {
        const updated = await this.version.execute({
            gameDirectory: environment.game.directory,
            infoFilePath: environment.version.infoFilePath,
            outputFilePath: environment.version.outputFilePath
        });

        await this.extract.execute({
            gameDirectory: environment.game.directory,
            zipFileName: environment.blueprints.zipFileName,
            extractToFolderPath: environment.blueprints.extractToFolderPath,
            force: updated
        });
    }
}
