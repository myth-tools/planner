import { Blueprints } from './blueprints';
import { Firebase } from './firebase';
import { Game } from './game';
import { VersionInfo } from './version-info';

export interface Environment {
    production: boolean;
    release: string;
    game: Game;
    firebase: Firebase;
    version: VersionInfo;
    blueprints: Blueprints;
}
