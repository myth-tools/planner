import { InjectionToken } from '@angular/core';
import { Environment } from '@myth-tools/model/wotr/environment';

export const ENVIRONMENT = new InjectionToken<Environment>('environment');
