import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { environment } from '../environments/environment';
import { ENVIRONMENT } from './environment';
import { Environment } from './models/environment';

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
