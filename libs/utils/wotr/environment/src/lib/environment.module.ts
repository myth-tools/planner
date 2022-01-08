import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Environment } from '@myth-tools/model/wotr/environment';
import { environment } from '../environments/environment';
import { ENVIRONMENT } from './environment';

@NgModule({})
export class EnvironmentModule {
    static forRoot(config?: Partial<Environment>): ModuleWithProviders<EnvironmentModule> {
        return {
            ngModule: EnvironmentModule,
            providers: [{ provide: ENVIRONMENT, useValue: { ...environment, ...config } }]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule?: EnvironmentModule) {
        if (parentModule) {
            throw new Error('EnvironmentModule is already loaded. Import it in the AppModule only');
        }
    }
}
