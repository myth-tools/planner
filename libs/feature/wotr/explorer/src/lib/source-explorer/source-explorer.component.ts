import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlueprintEvent, ExplorerItem, FileWithId } from '@myth-tools/model/blueprint';
import { SourceExplorerService } from './source-explorer.service';

@Component({
    selector: 'myth-tools-source-explorer',
    templateUrl: './source-explorer.component.html',
    styleUrls: ['./source-explorer.component.scss'],
    providers: [SourceExplorerService]
})
export class SourceExplorerComponent {
    @Input()
    public selected?: FileWithId;

    @Output()
    public fileClick = new EventEmitter<FileWithId>();

    constructor(public readonly sourceExplorer: SourceExplorerService) {}

    public onDirectoryClick(event: BlueprintEvent) {
        this.sourceExplorer.blueprintEvent(event);
    }

    public onFileClick(event: FileWithId) {
        this.fileClick.emit(event);
    }

    public itemTrackBy(_index: number, item: ExplorerItem) {
        return item.item.id;
    }
}
