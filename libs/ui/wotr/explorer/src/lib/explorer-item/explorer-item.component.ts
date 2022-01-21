import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlueprintEvent, BlueprintWithId, FileWithId } from '@myth-tools/model/blueprint';

@Component({
    selector: 'myth-tools-explorer-item[item]',
    templateUrl: './explorer-item.component.html',
    styleUrls: ['./explorer-item.component.scss']
})
export class ExplorerItemComponent {
    @Input()
    public item!: BlueprintWithId | FileWithId;

    @Input()
    public nestedLevel!: number;

    @Input()
    public index!: number;

    @Input()
    public isSelected = false;

    @Output()
    public directoryClick = new EventEmitter<BlueprintEvent>();

    @Output()
    public fileClick = new EventEmitter<FileWithId>();

    public isExpanded = false;

    public click() {
        if (!this.isBlueprint(this.item)) {
            this.fileClick.next(this.item);
            return;
        }

        this.isExpanded = !this.isExpanded;

        this.directoryClick.emit({
            isExpanded: this.isExpanded,
            nestedLevel: this.nestedLevel,
            index: this.index,
            blueprint: this.item
        });
    }

    public isBlueprint(blueprintOrFile: BlueprintWithId | FileWithId): blueprintOrFile is BlueprintWithId {
        return (<BlueprintWithId>blueprintOrFile).n !== undefined;
    }
}
