import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from '@myth-tools/model/blueprint';

@Component({
    selector: 'myth-tools-reference-list[lookup]',
    templateUrl: './reference-list.component.html',
    styleUrls: ['./reference-list.component.scss']
})
export class ReferenceListComponent {
    @Input()
    public lookup?: string;

    @Output()
    public selected = new EventEmitter<File>();
}
