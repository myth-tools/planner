import { Component, Input } from '@angular/core';
import { BlueprintWithId } from '@myth-tools/wotr/explorer/model/blueprint';

@Component({
    selector: 'myth-tools-directory[blueprint]',
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent {
    @Input()
    public blueprint!: BlueprintWithId;

    @Input()
    public isExpanded?: boolean;
}
