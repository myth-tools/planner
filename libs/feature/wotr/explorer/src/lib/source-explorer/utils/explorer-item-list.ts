import { BlueprintEvent, BlueprintWithId, ExplorerItem, FileWithId } from '@myth-tools/model/blueprint';
import { tail } from 'lodash-es';

export interface Options {
    explorerItems: ExplorerItem[];
    event: BlueprintEvent;
}

/**
 * This class takes the current explorer items and event and outputs the new updated list of items to render.
 * It handles opening and closing of directories.
 */
export class ExplorerItemList {
    public readonly items: ExplorerItem[];

    constructor({ explorerItems, event }: Options) {
        const items = this.toExplorerItems(event);

        const index = event.index + 1 ?? 0;

        if (event.isExpanded) {
            explorerItems.splice(index, 0, ...items);
        } else {
            const visibleItems = items.filter(item =>
                explorerItems.find(explorerItem => explorerItem.item.id === item.item.id)
            );

            explorerItems.splice(index, visibleItems.length);
        }

        this.items = explorerItems;
    }

    private toExplorerItems(event: BlueprintEvent) {
        const explorerItems = event.isExpanded
            ? [...event.blueprint.d, ...event.blueprint.f]
            : this.getAllItems([event.blueprint]);

        let items: ExplorerItem[] = explorerItems.map(item => ({ nestedLevel: event.nestedLevel + 1, item }));

        if (!event.isExpanded) {
            // If we are not expanding, ignore the first item as it's the actual directory clicked on and we don't want
            // to remove parent directories from the list.
            items = tail(items);
        }

        return items;
    }

    private getAllItems(blueprints: BlueprintWithId[]) {
        const items: (BlueprintWithId | FileWithId)[] = [];

        for (const blueprint of blueprints) {
            items.push(blueprint);

            for (const file of blueprint.f) {
                items.push(file);
            }

            items.push(...this.getAllItems(blueprint.d));
        }

        return items;
    }
}
