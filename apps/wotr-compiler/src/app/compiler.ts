import { Blueprints, Version, Options, Bundles } from '@myth-tools/wotr-compiler/feature/compiler';
import { Extractor } from '@myth-tools/wotr-compiler/feature/extractor';
import { join } from 'path';

export class Compiler {
    constructor(
        private readonly blueprints: Options,
        private readonly version: Options,
        private readonly foldersOfInterest: string[]
    ) {}

    public async execute() {
        const version = new Version(this.version);
        const blueprints = new Blueprints(this.blueprints);
        const bundles = new Bundles();

        // Extract the game version and inject it into the app environment.ts
        //await version.extract();

        // Clean the blueprint folder and extract the blueprints from the game folder.
        await blueprints.clean();
        await blueprints.extract(this.foldersOfInterest);

        const file = join(this.version.root, 'Bundles', 'portraits');

        // await bundles.extract(file, 'bundles');

        // await new Extractor().loadFiles(['blueprints/Backgrounds/t.test']);
    }
}
