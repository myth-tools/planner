import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FileWithId } from '@myth-tools/wotr/explorer/model/blueprint';

@Component({
    selector: 'myth-tools-open-files',
    templateUrl: './open-files.component.html',
    styleUrls: ['./open-files.component.scss']
})
export class OpenFilesComponent {
    @Input()
    public files: FileWithId[] = [];

    @Input()
    public selected?: FileWithId;

    @Output()
    public selectedChange = new EventEmitter<FileWithId>();

    @Output()
    public closeFile = new EventEmitter<FileWithId>();

    @HostListener('wheel', ['$event'])
    public onWheel(event: WheelEvent) {
        event.preventDefault();
        this.elementRef.nativeElement.scrollLeft += event.deltaY;
    }

    constructor(private readonly elementRef: ElementRef) {}

    public onCloseFile(file: FileWithId) {
        if (this.selected?.id === file.id) {
            this.selectedChange.emit(this.selected);
        }

        this.closeFile.emit(file);
    }

    public onSelectFile(file: FileWithId) {
        this.selectedChange.emit(file);
    }
}
