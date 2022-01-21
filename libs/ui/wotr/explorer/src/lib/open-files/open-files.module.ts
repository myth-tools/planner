import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@myth-tools/utils/shared/web';
import { OpenFileComponent } from './open-file/open-file.component';
import { OpenFilesComponent } from './open-files.component';

@NgModule({
    declarations: [OpenFilesComponent, OpenFileComponent],
    imports: [CommonModule, MaterialModule],
    exports: [OpenFilesComponent],
    providers: []
})
export class OpenFilesModule {}
