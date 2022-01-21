import { Blueprints } from './blueprints';
import { Firebase } from './firebase';
import { Game } from './game';

export interface Environment {
    production: boolean;
    release: string;
    game: Game;
    firebase: Firebase;
    blueprints: Blueprints;
}
