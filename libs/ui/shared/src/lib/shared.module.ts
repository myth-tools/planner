import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from './layout/layout.module';

@NgModule({
    imports: [CommonModule, LayoutModule],
    exports: [CommonModule, LayoutModule]
})
export class SharedModule {}
