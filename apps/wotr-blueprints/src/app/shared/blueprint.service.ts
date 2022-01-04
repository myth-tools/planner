import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Entity, EntityHash } from '../data-models/entity';
import { Blueprint, BlueprintResponse } from '../data-models/blueprint';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
    public readonly hash = new Map<string, EntityHash>();

    constructor(private readonly http: HttpClient) {}

    public get$(): Observable<BlueprintResponse[]> {
        return this.http
            .get<Blueprint[]>(`/assets/all-blueprints/${environment.indexFileName}.json`)
            .pipe(this.getChildren$());
    }

    private getChildren$(): (source$: Observable<Blueprint[]>) => Observable<BlueprintResponse[]> {
        return (source$: Observable<Blueprint[]>) =>
            source$.pipe(
                switchMap(blueprints =>
                    forkJoin(
                        blueprints
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(blueprint => {
                                if (!blueprint.children.length) {
                                    return this.getBlueprint$(blueprint).pipe(
                                        tap(entities => {
                                            entities.forEach(entity =>
                                                this.hash.set(entity.AssetId, { entity, name: blueprint.name })
                                            );
                                        }),
                                        map(entities => ({
                                            name: blueprint.name,
                                            entities,
                                            isExpanded: false,
                                            children: []
                                        }))
                                    );
                                }

                                return of(blueprint.children.sort((a, b) => a.name.localeCompare(b.name))).pipe(
                                    delay(1000),
                                    this.getChildren$(),
                                    map(b => {
                                        const entities = b.findIndex(c => c.name.includes('index.json'));
                                        const bb: BlueprintResponse = {
                                            name: blueprint.name,
                                            entities: [],
                                            isExpanded: false,
                                            children: b
                                        };

                                        if (entities > -1) {
                                            bb.entities = b[entities].entities;
                                            b.splice(entities, 1);
                                        }

                                        return bb;
                                    })
                                );
                            })
                    )
                )
            );
    }

    private getBlueprint$(blueprint: Blueprint): Observable<Entity[]> {
        return this.http.get<Entity[]>(`/assets/all-blueprints/${blueprint.name}`);
    }
}
