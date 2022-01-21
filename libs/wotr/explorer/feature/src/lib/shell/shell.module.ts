import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@myth-tools/web/utils/material';
import { BlueprintModule } from '@myth-tools/wotr/explorer/data-access/blueprint';
import { ResizableModule } from 'angular-resizable-element';
import { FileWindowModule } from '../file-window/file-window.module';
import { ReferenceListModule } from '../reference-list/reference-list.module';
import { SourceExplorerModule } from '../source-explorer/source-explorer.module';
import { ShellComponent } from './shell.component';

@NgModule({
    declarations: [ShellComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ShellComponent
            }
        ]),
        MaterialModule,
        ResizableModule,
        SourceExplorerModule,
        FileWindowModule,
        ReferenceListModule,
        BlueprintModule.forRoot()
    ]
})
export class ShellModule {}
