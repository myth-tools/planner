import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@myth-tools/web/utils/material';
import { ExplorerUIModule } from '@myth-tools/wotr/explorer/ui';
import { SourceExplorerComponent } from './source-explorer.component';
import { ViewStateCacheDirective } from './view-state-cache.directive';

@NgModule({
    declarations: [SourceExplorerComponent, ViewStateCacheDirective],
    imports: [CommonModule, MaterialModule, ExplorerUIModule],
    exports: [SourceExplorerComponent],
    providers: []
})
export class SourceExplorerModule {}
