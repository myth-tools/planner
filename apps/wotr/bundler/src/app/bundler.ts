import { BundleExplorer } from '@myth-tools/wotr/bundler/feature/bundle-explorer';
import { Extract } from '@myth-tools/wotr/bundler/feature/extract';
import { Version } from '@myth-tools/wotr/bundler/feature/version';
import { environment } from '@myth-tools/wotr/node/utils/environment';

export class Bundler {
    private readonly version = new Version();
    private readonly extract = new Extract();
    private readonly bundleExplorer = new BundleExplorer();

    public async execute() {
        const updated = await this.version.execute({
            gameDirectory: environment.game.directory,
            infoFilePath: environment.version.infoFilePath,
            outputFilePaths: environment.version.outputFilePaths
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
