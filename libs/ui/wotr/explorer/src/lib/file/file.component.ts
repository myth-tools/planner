import { Component, Input } from '@angular/core';
import { FileWithId } from '@myth-tools/model/blueprint';

@Component({
    selector: 'myth-tools-file[file]',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss']
})
export class FileComponent {
    @Input()
    public file!: FileWithId;

    @Input()
    public isSelected = false;
}
