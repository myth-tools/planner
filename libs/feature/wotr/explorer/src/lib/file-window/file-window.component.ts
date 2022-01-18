import { Component, EventEmitter, HostBinding, Input, Output, ViewContainerRef } from '@angular/core';
import { File } from '@myth-tools/model/blueprint';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
    selector: 'myth-tools-file-window[minWidth]',
    templateUrl: './file-window.component.html',
    styleUrls: ['./file-window.component.scss']
})
export class FileWindowComponent {
    @HostBinding('style.gridTemplateColumns')
    public get gridTemplateColumns() {
        return `minmax(${this.minWidth}px, 1fr) ${this.reference ? `minmax(${this.minWidth}px, ${this.width})` : ''} `;
    }

    @HostBinding('style.gridTemplateAreas')
    public get gridTemplateAreas() {
        return this.reference ? `'preview reference'` : `'preview'`;
    }

    @Input()
    public preview?: File;

    @Input()
    public reference?: File;

    @Input()
    public minWidth!: number;

    @Output()
    public lookup = new EventEmitter<string>();

    private width = '1fr';

    constructor(private readonly viewContainer: ViewContainerRef) {}

    public onReferenceResize({ rectangle }: ResizeEvent) {
        const { width } = rectangle;

        this.width = `${width}px`;
    }

    /** Ensure that you can only resize the elements between sizes that make sense. */
    public validateResize() {
        return ({ rectangle }: ResizeEvent) => {
            const width = rectangle.width ?? 0;

            const isSmallerThenContainer = width < this.viewContainer.element.nativeElement.clientWidth - this.minWidth;
            const isLargerThenMinimum = width > this.minWidth;

            return isSmallerThenContainer && isLargerThenMinimum;
        };
    }
}
