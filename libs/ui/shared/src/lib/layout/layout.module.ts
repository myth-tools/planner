import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [LayoutComponent, FooterComponent],
    imports: [CommonModule],
    exports: [LayoutComponent],
    providers: []
})
export class LayoutModule {}
