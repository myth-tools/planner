import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@myth-tools/utils/shared/web';
import { DirectoryComponent } from './directory/directory.component';
import { ExplorerItemComponent } from './explorer-item/explorer-item.component';
import { FileComponent } from './file/file.component';

@NgModule({
    declarations: [DirectoryComponent, FileComponent, ExplorerItemComponent],
    imports: [CommonModule, MaterialModule],
    exports: [DirectoryComponent, FileComponent, ExplorerItemComponent]
})
export class ExplorerUIModule {}
