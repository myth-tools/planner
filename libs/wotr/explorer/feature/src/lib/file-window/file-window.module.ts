import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExplorerUIModule } from '@myth-tools/wotr/explorer/ui';
import { FileWindowComponent } from './file-window.component';

@NgModule({
    declarations: [FileWindowComponent],
    imports: [CommonModule, ExplorerUIModule],
    exports: [FileWindowComponent],
    providers: []
})
export class FileWindowModule {}
