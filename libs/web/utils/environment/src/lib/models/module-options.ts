import { InjectionToken } from '@angular/core';

export interface ModuleOptions<TEnvironment> {
    token: InjectionToken<TEnvironment>;
    config: Partial<TEnvironment>;
}
