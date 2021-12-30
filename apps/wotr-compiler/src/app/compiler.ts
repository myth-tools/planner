import { Blueprints, Version, Options } from '@myth-tools/wotr-compiler/feature/compiler';

export class Compiler {
    constructor(
        private readonly blueprints: Options,
        private readonly version: Options,
        private readonly foldersOfInterest: string[]
    ) {}

    public async execute() {
        const version = new Version(this.version);
        const blueprints = new Blueprints(this.blueprints);

        // Extract the game version and inject it into the app environment.ts
        await version.extract();

        // Clean the blueprint folder and extract the blueprints from the game folder.
        await blueprints.clean();
        await blueprints.extract(this.foldersOfInterest);
    }
}
