import { Blueprints } from './blueprints';
import { Game } from './game';
import { VersionInfo } from './version-info';

export interface Environment {
    production: boolean;
    release: string;
    game: Game;
    version: VersionInfo;
    blueprints: Blueprints;
}
