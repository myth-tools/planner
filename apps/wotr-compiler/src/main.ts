import { Options } from '@myth-tools/wotr-compiler/feature/compiler';
import { Compiler } from './app/compiler';
import { environment } from './environments/environment';

const blueprints: Options = {
    root: environment.root,
    file: environment.blueprints.file,
    output: environment.blueprints.output
};

const version: Options = {
    root: environment.root,
    file: environment.version.file,
    output: environment.version.output
};

const compiler = new Compiler(blueprints, version, environment.foldersOfInterest);

compiler.execute().catch(console.error);
