import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@myth-tools/web/utils/material';
import { DirectoryComponent } from './directory/directory.component';
import { EntityComponent } from './entity/entity.component';
import { ExplorerItemComponent } from './explorer-item/explorer-item.component';
import { FileComponent } from './file/file.component';
import { OpenFilesModule } from './open-files/open-files.module';

@NgModule({
    declarations: [DirectoryComponent, FileComponent, ExplorerItemComponent, EntityComponent],
    imports: [CommonModule, MaterialModule, OpenFilesModule],
    exports: [OpenFilesModule, DirectoryComponent, FileComponent, ExplorerItemComponent, EntityComponent]
})
export class ExplorerUIModule {}
