import { Component } from '@angular/core';
import { BlueprintEvent, ExplorerItem } from '@myth-tools/model/blueprint';
import { SourceExplorerService } from './source-explorer.service';

@Component({
    selector: 'myth-tools-source-explorer',
    templateUrl: './source-explorer.component.html',
    styleUrls: ['./source-explorer.component.scss'],
    providers: [SourceExplorerService]
})
export class SourceExplorerComponent {
    constructor(public readonly sourceExplorer: SourceExplorerService) {}

    public onDirectoryClick(event: BlueprintEvent) {
        this.sourceExplorer.blueprintEvent(event);
    }

    public itemTrackBy(_index: number, item: ExplorerItem) {
        return item.item.id;
    }
}
