import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { EntityHash, EntitySource } from '../data-models/entity';
import { Blueprint, BlueprintResponse } from '../data-models/blueprint';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
    public readonly hash = new Map<string, EntityHash>();

    constructor(private readonly http: HttpClient) {}

    public get$(): Observable<BlueprintResponse[]> {
        return this.http
            .get<Blueprint[]>(`/assets/all-blueprints/${environment.manifestFileName}.json`)
            .pipe(this.getBlueprints$());
    }

    private getBlueprints$(): (source$: Observable<Blueprint[]>) => Observable<BlueprintResponse[]> {
        return (source$: Observable<Blueprint[]>) =>
            source$.pipe(
                switchMap(blueprints =>
                    forkJoin(
                        this.orderedBlueprints(blueprints).map(blueprint => {
                            const name = blueprint.name;

                            if (!blueprint.blueprints.length) {
                                return this.getEntities$(blueprint).pipe(
                                    map(entities => ({
                                        name,
                                        entities,
                                        isExpanded: false,
                                        blueprints: []
                                    }))
                                );
                            }

                            return of(this.orderedBlueprints(blueprint.blueprints)).pipe(
                                delay(1500), // delay to stop browser from breaking with so many file requests
                                this.getBlueprints$(),
                                map(blueprints => {
                                    const entitiesIndex = blueprints.findIndex(entity =>
                                        entity.name.includes(`${environment.indexFileName}.json`)
                                    );

                                    const blueprint: BlueprintResponse = {
                                        name,
                                        entities: [],
                                        isExpanded: false,
                                        blueprints
                                    };

                                    // Remove entities entry and add to parent blueprint.
                                    if (entitiesIndex > -1) {
                                        blueprint.entities = blueprints[entitiesIndex].entities;
                                        blueprints.splice(entitiesIndex, 1);
                                    }

                                    return blueprint;
                                })
                            );
                        })
                    )
                )
            );
    }

    private getEntities$(blueprint: Blueprint): Observable<EntitySource[]> {
        return this.http.get<EntitySource[]>(`/assets/all-blueprints/${blueprint.name}`).pipe(this.toHash(blueprint));
    }

    private orderedBlueprints(blueprints: Blueprint[]) {
        return blueprints.sort((a, b) => a.name.localeCompare(b.name));
    }

    private toHash(blueprint: Blueprint) {
        return ($source: Observable<EntitySource[]>) =>
            $source.pipe(
                tap(entities =>
                    entities.forEach(entity => this.hash.set(entity.entity.AssetId, { entity, name: blueprint.name }))
                )
            );
    }
}
