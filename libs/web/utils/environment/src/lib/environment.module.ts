import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ModuleOptions } from './models/module-options';

@NgModule({})
export class EnvironmentModule {
    static forRoot<T>({ token, config }: ModuleOptions<T>): ModuleWithProviders<EnvironmentModule> {
        return {
            ngModule: EnvironmentModule,
            providers: [{ provide: token, useValue: { ...config } }]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule?: EnvironmentModule) {
        if (parentModule) {
            throw new Error('EnvironmentModule is already loaded. Import it in the AppModule only');
        }
    }
}
