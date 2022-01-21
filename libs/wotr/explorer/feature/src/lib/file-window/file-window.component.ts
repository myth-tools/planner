import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { File, FileWithId } from '@myth-tools/wotr/explorer/model/blueprint';

@Component({
    selector: 'myth-tools-file-window',
    templateUrl: './file-window.component.html',
    styleUrls: ['./file-window.component.scss']
})
export class FileWindowComponent implements OnChanges {
    @Input()
    public files: FileWithId[] = [];

    @Input()
    public selected?: FileWithId;

    @Input()
    public reference?: File;

    @Output()
    public lookup = new EventEmitter<string>();

    @Output()
    public filesChange = new EventEmitter<FileWithId[]>();

    @Output()
    public selectedChange = new EventEmitter<FileWithId>();

    public ngOnChanges(): void {
        if (this.files.length && !this.selected) {
            this.selectedChange.emit(this.files[0]);
        }
    }

    public onCloseFile(file: FileWithId) {
        this.files = this.files.filter(existingFile => existingFile.id !== file.id);
        this.filesChange.emit(this.files);

        if (this.selected?.id === file.id) {
            this.selectedChange.emit(undefined);
        }
    }
}
