import { Compile } from './compile';

export class Blueprints {
    public async extract() {
        // TODO.
    }

    /** Compiles the blueprints into fewer larger files, friendly for the browser. */
    public async compile() {
        const compile = new Compile();
        await compile.execute('blueprints');
    }
}
