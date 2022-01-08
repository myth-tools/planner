import { Bundler } from './app/bundler';

const bundler = new Bundler();

bundler.execute().catch(console.error);
