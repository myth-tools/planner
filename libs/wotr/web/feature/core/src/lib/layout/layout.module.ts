import { NgModule } from '@angular/core';
import { FooterModule } from '../footer/footer.module';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [LayoutComponent],
    imports: [FooterModule],
    exports: [LayoutComponent],
    providers: []
})
export class LayoutModule {}
