import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const modules = [MatIconModule, ScrollingModule];

@NgModule({
    declarations: [],
    imports: modules,
    exports: modules,
    providers: []
})
export class MaterialModule {}
