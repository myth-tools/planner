import { InjectionToken, Provider } from '@angular/core';

export function windowFactory(): Window {
    return window;
}

export const WINDOW = new InjectionToken<Window>('window');
export const WINDOW_PROVIDER: Provider = { provide: WINDOW, useFactory: windowFactory };
