import { Component, HostBinding, ViewContainerRef } from '@angular/core';
import { File } from '@myth-tools/model/blueprint';
import { ResizeEvent } from 'angular-resizable-element';

type ElementType = 'source-explorer' | 'reference-list';
@Component({
    selector: 'myth-tools-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {
    @HostBinding('style.gridTemplateColumns')
    public get gridTemplateColumns() {
        return `minmax(${this.minSize}px, ${this.sourceExplorerWidth}) 1fr`;
    }

    @HostBinding('style.gridTemplateRows')
    public get gridTemplateRows() {
        return `minmax(${this.minSize}px, 1fr) ${
            this.lookup ? `minmax(${this.minSize}px, ${this.referenceListHeight})` : ''
        }`;
    }

    @HostBinding('style.gridTemplateAreas')
    public get gridTemplateAreas() {
        return this.lookup
            ? `'source-explorer file-window'
        'source-explorer reference-list'`
            : `'source-explorer file-window'
        'source-explorer file-window'`;
    }

    /** Minimum size in px that the element can be. */
    public readonly minSize = 200;

    public reference?: File;
    public lookup?: string;

    private sourceExplorerWidth = '300px';
    private referenceListHeight = '200px';

    constructor(private readonly viewContainer: ViewContainerRef) {}

    public onSelectedReference(file: File) {
        this.reference = file;
    }

    public onLookup(lookup: string) {
        this.lookup = lookup;
    }

    public onSourceExplorerResize({ rectangle }: ResizeEvent) {
        const width = rectangle.width ?? 0;
        const containerWidth = this.viewContainer.element.nativeElement.clientWidth ?? this.minSize;

        this.sourceExplorerWidth = `${Math.min(width, containerWidth - this.minSize)}px`;
    }

    public onReferenceListResize({ rectangle }: ResizeEvent) {
        const height = rectangle.height ?? 0;
        const containerHeight = this.viewContainer.element.nativeElement.clientHeight ?? this.minSize;

        this.referenceListHeight = `${Math.min(height, containerHeight - this.minSize)}px`;
    }

    /** Ensure that you can only resize the elements between sizes that make sense. */
    public validateResize(type: ElementType) {
        return ({ rectangle }: ResizeEvent) => {
            if (type === 'source-explorer') {
                const containerWidth = this.viewContainer.element.nativeElement.clientWidth ?? this.minSize;

                return rectangle.right > this.minSize && rectangle.right < containerWidth - this.minSize * 2;
            }

            if (type === 'reference-list') {
                const height = rectangle.height ?? 0;
                const containerHeight = this.viewContainer.element.nativeElement.clientHeight ?? this.minSize;

                return height > this.minSize && height < containerHeight - this.minSize;
            }

            return false;
        };
    }
}
