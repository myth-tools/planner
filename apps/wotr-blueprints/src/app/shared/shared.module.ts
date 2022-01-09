import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyForDirective } from './lazy-for.directive';
import { GuidComponent } from './guid/guid.component';

@NgModule({
    declarations: [LazyForDirective, GuidComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, LazyForDirective, GuidComponent],
    providers: []
})
export class SharedModule {}
