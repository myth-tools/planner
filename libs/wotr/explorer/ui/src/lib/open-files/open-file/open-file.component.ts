import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileWithId } from '@myth-tools/wotr/explorer/model/blueprint';

@Component({
    selector: 'myth-tools-open-file[file]',
    templateUrl: './open-file.component.html',
    styleUrls: ['./open-file.component.scss']
})
export class OpenFileComponent {
    @Input()
    public file!: FileWithId;

    @Input()
    public isSelected = false;

    @Output()
    public closeFile = new EventEmitter<FileWithId>();

    @Output()
    public selectFile = new EventEmitter<FileWithId>();

    public onCloseFile() {
        this.closeFile.emit(this.file);
    }

    public onSelectFile() {
        this.selectFile.emit(this.file);
    }
}
