import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintComponent } from './blueprint.component';
import { EntityComponent } from './entity.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
    declarations: [BlueprintComponent, EntityComponent],
    imports: [CommonModule, MaterialModule],
    exports: [BlueprintComponent, EntityComponent],
    providers: []
})
export class BlueprintModule {}
