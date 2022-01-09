import { BundleExplorer } from '@myth-tools/feature/wotr/bundle-explorer';
import { Extract } from '@myth-tools/feature/wotr/extract';
import { Version } from '@myth-tools/feature/wotr/version';
import { environment } from '@myth-tools/utils/wotr/environment/node';

export class Bundler {
    private readonly version = new Version();
    private readonly extract = new Extract();
    private readonly bundleExplorer = new BundleExplorer();

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

        await this.bundleExplorer.execute({
            extractToFolderPath: environment.blueprints.extractToFolderPath,
            outputFilePath: environment.blueprints.outputFilePath,
            outputFileName: environment.blueprints.outputFileName
        });
    }
}
