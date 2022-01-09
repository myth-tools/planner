import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintComponent } from './blueprint.component';
import { EntityComponent } from './entity.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [BlueprintComponent, EntityComponent],
    imports: [CommonModule, MaterialModule, SharedModule],
    exports: [BlueprintComponent, EntityComponent],
    providers: []
})
export class BlueprintModule {}
