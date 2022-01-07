import { Compile, Extract, Version } from '@myth-tools/wotr-compiler/feature/compiler';
import { environment } from '../environments/environment';

export class Compiler {
    public async execute() {
        const extract = new Extract();
        const compile = new Compile();
        const version = new Version();

        // Extract blueprints from zip in game directory.
        /* await extract.execute({
            gameDirectory: environment.gameDirectory,
            zipFile: environment.blueprints.zipFile,
            extractFolder: environment.blueprints.extractFolder
        }); */

        // Compile blueprints in a format easily accessible to the browser.
        await compile.execute({
            extractFolder: environment.blueprints.extractFolder,
            compileFolder: environment.blueprints.compileFolder,
            indexFileName: environment.blueprints.indexFileName,
            manifestFileName: environment.blueprints.manifestFileName
        });

        // Extract the game version and inject it into the apps environment.ts
        /* await version.execute({
            gameDirectory: environment.gameDirectory,
            versionInfoFile: environment.version.versionInfoFile,
            outputFile: environment.version.outputFile
        }); */
    }
}
