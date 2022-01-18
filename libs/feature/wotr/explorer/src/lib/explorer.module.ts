import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlueprintModule } from '@myth-tools/data-access/wotr/blueprint';
import { ExplorerUIModule } from '@myth-tools/ui/wotr/explorer';
import { MaterialModule, WINDOW_PROVIDER } from '@myth-tools/utils/shared/web';
import { ResizableModule } from 'angular-resizable-element';
import { ExplorerComponent } from './explorer.component';
import { FileWindowComponent } from './file-window/file-window.component';
import { ReferenceListComponent } from './reference-list/reference-list.component';
import { SourceExplorerComponent } from './source-explorer/source-explorer.component';
import { ViewStateCacheDirective } from './source-explorer/view-state-cache.directive';

@NgModule({
    declarations: [
        ExplorerComponent,
        SourceExplorerComponent,
        FileWindowComponent,
        ReferenceListComponent,
        ViewStateCacheDirective
    ],
    imports: [
        CommonModule,
        BlueprintModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ExplorerComponent
            }
        ]),
        MaterialModule,
        ExplorerUIModule,
        ResizableModule
    ],
    providers: [WINDOW_PROVIDER]
})
export class ExplorerModule {}
