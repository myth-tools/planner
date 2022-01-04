import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { SharedModule } from '../shared/shared.module';
import { BlueprintModule } from '../blueprint/blueprint.module';
import { ReferencesComponent } from './references.component';

@NgModule({
    declarations: [SearchComponent, ResultComponent, ReferencesComponent],
    imports: [SharedModule, MaterialModule, BlueprintModule],
    exports: [SearchComponent, ResultComponent],
    providers: []
})
export class SearchModule {}
