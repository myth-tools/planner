import { Component, HostBinding, ViewContainerRef } from '@angular/core';
import { File, FileWithId } from '@myth-tools/wotr/explorer/model/blueprint';
import { ResizeEvent } from 'angular-resizable-element';

enum Unit {
    fr = 'fr',
    px = 'px'
}

interface ElementSize {
    size: number;
    unit: Unit;
}

@Component({
    selector: 'myth-tools-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
    @HostBinding('style.gridTemplateColumns')
    public get gridTemplateColumns() {
        const sourceExplorerWidth = `minmax(${this.minSize}px, ${this.sourceExplorer.size}${this.sourceExplorer.unit})`;
        const fileWindowWidth = `minmax(${this.minSize}px, 1fr)`;
        const referenceWidth = `minmax(${this.minSize}px, ${this.reference.size}${this.reference.unit})`;

        return `${sourceExplorerWidth} ${fileWindowWidth} ${referenceWidth}`;
    }

    @HostBinding('style.gridTemplateRows')
    public get gridTemplateRows() {
        return `minmax(${this.minSize}px, 1fr) ${
            this.lookup ? `minmax(${this.minSize}px, ${this.referenceList})` : ''
        }`;
    }

    @HostBinding('style.gridTemplateAreas')
    public get gridTemplateAreas() {
        const topRow = `'source-explorer ${this.files.length ? 'file-window reference' : ''}'`;
        const bottomRow = `'source-explorer ${
            this.lookup ? 'reference-list' : this.files.length ? 'file-window reference' : ''
        }'`;

        return `${topRow} ${bottomRow}`;
    }

    public files: FileWithId[] = [];
    public references?: File;
    public lookup?: string;
    public selected?: FileWithId;

    /** Minimum size in px that the element can be. */
    public readonly minSize = 200;

    private sourceExplorer: ElementSize = { size: 300, unit: Unit.px };
    private reference: ElementSize = { size: 1, unit: Unit.fr };
    private referenceList: ElementSize = { size: 200, unit: Unit.px };

    constructor(private readonly viewContainer: ViewContainerRef) {}

    public onFileClick(file: FileWithId) {
        const exists = this.files.find(existingFile => existingFile.id === file.id);

        if (!exists) {
            this.files = [...this.files, file];
        }
    }

    public onSelectedReference(file: File) {
        this.references = file;
    }

    public onLookup(lookup: string) {
        this.lookup = lookup;
    }

    public onSourceExplorerResize({ rectangle }: ResizeEvent) {
        const width = rectangle.width ?? 0;
        const containerWidth = this.viewContainer.element.nativeElement.clientWidth ?? this.minSize;

        this.sourceExplorer = { size: Math.min(width, containerWidth - this.minSize), unit: Unit.px };

        if (this.files.length && this.reference.unit !== Unit.fr) {
            this.reference = {
                size: Math.min(
                    Math.max(this.minSize, this.reference.size),
                    containerWidth - (this.minSize + this.sourceExplorer.size)
                ),
                unit: Unit.px
            };
        }
    }

    public onReferenceResize({ rectangle }: ResizeEvent) {
        const width = rectangle.width ?? 0;

        this.reference = { size: width, unit: Unit.px };
    }

    public onReferenceListResize({ rectangle }: ResizeEvent) {
        const height = rectangle.height ?? 0;
        const containerHeight = this.viewContainer.element.nativeElement.clientHeight ?? this.minSize;

        this.referenceList = { size: Math.min(height, containerHeight - this.minSize), unit: Unit.px };
    }

    /** Ensure that you can only resize the elements between sizes that make sense. */
    public validateSourceExplorer() {
        return ({ rectangle }: ResizeEvent) => {
            const containerWidth = this.viewContainer.element.nativeElement.clientWidth ?? this.minSize;

            return rectangle.right >= this.minSize && rectangle.right <= containerWidth - this.minSize * 2;
        };
    }

    /** Ensure that you can only resize the elements between sizes that make sense. */
    public validateReference() {
        return ({ rectangle }: ResizeEvent) => {
            const width = rectangle.width ?? 0;
            const minimumContainerWidth =
                this.viewContainer.element.nativeElement.clientWidth - this.sourceExplorer.size - this.minSize;

            const isSmallerThenContainer = width <= minimumContainerWidth;
            const isLargerThenMinimum = width >= this.minSize;

            return isSmallerThenContainer && isLargerThenMinimum;
        };
    }

    /** Ensure that you can only resize the elements between sizes that make sense. */
    public validateReferenceList() {
        return ({ rectangle }: ResizeEvent) => {
            const height = rectangle.height ?? 0;
            const containerHeight = this.viewContainer.element.nativeElement.clientHeight ?? this.minSize;

            return height > this.minSize && height < containerHeight - this.minSize;
        };
    }
}
