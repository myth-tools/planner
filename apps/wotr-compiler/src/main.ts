import { Compiler } from './app/compiler';

const compiler = new Compiler();

compiler.execute().catch(console.error);
