import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReferenceListComponent } from './reference-list.component';

@NgModule({
    declarations: [ReferenceListComponent],
    imports: [CommonModule],
    exports: [ReferenceListComponent],
    providers: []
})
export class ReferenceListModule {}
