import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BlueprintService } from './blueprint.service';

@NgModule({
    declarations: [],
    imports: [HttpClientModule],
    exports: [HttpClientModule],
    providers: []
})
export class BlueprintModule {
    public static forRoot(): ModuleWithProviders<BlueprintModule> {
        return {
            ngModule: BlueprintModule,
            providers: [BlueprintService]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule?: BlueprintModule) {
        if (parentModule) {
            throw new Error('BlueprintModule is already loaded. Import it in the AppModule only');
        }
    }
}
