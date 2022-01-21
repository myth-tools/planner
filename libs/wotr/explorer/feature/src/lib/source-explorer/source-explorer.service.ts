import { Injectable } from '@angular/core';
import { BlueprintService } from '@myth-tools/wotr/explorer/data-access/blueprint';
import { Blueprint, BlueprintEvent, BlueprintWithId, ExplorerItem } from '@myth-tools/wotr/explorer/model/blueprint';
import { combineLatest, map, Observable, scan, shareReplay, startWith, Subject } from 'rxjs';
import { ExplorerItemList } from './utils/explorer-item-list';

export type ExplorerItemEvent = { event?: BlueprintEvent; items: ExplorerItem[] };

@Injectable({
    providedIn: 'root'
})
export class SourceExplorerService {
    private id = 0;
    private onBlueprintEvent = new Subject<BlueprintEvent>();

    constructor(private readonly blueprint: BlueprintService) {}

    private blueprints$: Observable<ExplorerItem[]> = this.blueprint.get$().pipe(
        map(blueprints => blueprints.map(blueprint => ({ item: this.withId(blueprint), nestedLevel: 0 }))),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    public explorerItems$: Observable<ExplorerItemEvent> = combineLatest([
        this.onBlueprintEvent.pipe(startWith(undefined)),
        this.blueprints$
    ]).pipe(
        scan(([, explorerItems], [event]) => {
            const result: [BlueprintEvent | undefined, ExplorerItem[]] = [event, explorerItems];

            if (!event) {
                return result;
            }

            const { items } = new ExplorerItemList({ explorerItems, event });

            result[1] = items;

            return result;
        }),
        // Break reference of items so the view updates.
        map(([event, items]) => ({ event, items: [...items] }))
    );

    public blueprintEvent(event: BlueprintEvent) {
        this.onBlueprintEvent.next(event);
    }

    private withId(blueprint: Blueprint) {
        const blueprintWithId: BlueprintWithId = {
            id: this.id++,
            n: blueprint.n,
            d: blueprint.d.map(directory => this.withId(directory)),
            f: blueprint.f.map(file => ({ ...file, id: this.id++ }))
        };

        return blueprintWithId;
    }
}
