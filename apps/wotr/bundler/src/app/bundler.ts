import { Version } from '@myth-tools/feature/wotr/version';
import { environment } from '@myth-tools/utils/wotr/environment/node';

export class Bundler {
    private readonly version = new Version();

    public async execute() {
        await this.version.execute({
            gameDirectory: environment.game.directory,
            infoFilePath: environment.version.infoFilePath,
            outputFilePath: environment.version.outputFilePath
        });
    }
}
