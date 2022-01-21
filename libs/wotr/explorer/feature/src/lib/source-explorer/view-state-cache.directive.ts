import {
    AfterContentInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    QueryList,
    SimpleChanges
} from '@angular/core';
import { BlueprintEvent, ExplorerItem } from '@myth-tools/wotr/explorer/model/blueprint';
import { ExplorerItemComponent } from '@myth-tools/wotr/explorer/ui';
import { Subject, takeUntil } from 'rxjs';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'view-state-cache[items]'
})
export class ViewStateCacheDirective implements AfterContentInit, OnChanges, OnDestroy {
    @ContentChildren(ExplorerItemComponent, { descendants: true })
    public explorerItems?: QueryList<ExplorerItemComponent>;

    @Input()
    public items!: ExplorerItem[];

    @Input()
    public event?: BlueprintEvent;

    private viewStateCache = new Map<number, boolean>();
    private differ: IterableDiffer<ExplorerItemComponent>;
    private destroyed = new Subject<void>();

    constructor(private readonly differs: IterableDiffers, private readonly changeDetector: ChangeDetectorRef) {
        this.differ = this.differs.find([]).create();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const { items, event } = changes;

        if (items) {
            this.updateItems(items);
        }

        if (event) {
            this.updateEvent(event);
        }
    }

    public ngAfterContentInit(): void {
        if (!this.explorerItems) {
            return;
        }

        this.explorerItems.changes.pipe(takeUntil(this.destroyed)).subscribe(queryList => {
            const components = this.differ.diff(queryList);

            if (!components) {
                return;
            }

            let anyValuesChanged = false;

            components.forEachAddedItem(({ item }) => {
                const currentValue = item.isExpanded;

                item.isExpanded = this.viewStateCache.get(item.item.id) ?? false;

                if (currentValue !== item.isExpanded) {
                    anyValuesChanged = true;
                }
            });

            // Only run change detector if we changed the value of any items.
            if (anyValuesChanged) {
                this.changeDetector.detectChanges();
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

    private updateEvent({ currentValue }: { currentValue: BlueprintEvent }) {
        if (!currentValue) {
            return;
        }

        this.viewStateCache.set(currentValue.blueprint.id, currentValue.isExpanded);
    }

    private updateItems({
        previousValue,
        currentValue
    }: {
        previousValue: ExplorerItem[];
        currentValue: ExplorerItem[];
    }) {
        let explorerItems: ExplorerItem[] = [];

        if (previousValue) {
            // Get all previous explorer items that are no longer in the list.
            explorerItems = previousValue.filter(
                previous => !currentValue.find(current => current.item.id === previous.item.id)
            );
        }

        // The item is no longer visible (parent directory was closed), so lets update the cache to close the
        // sub directory items too.
        for (const { item } of explorerItems) {
            this.viewStateCache.set(item.id, false);
        }
    }
}
