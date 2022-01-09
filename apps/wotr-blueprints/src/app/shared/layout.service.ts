import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    constructor(private readonly breakpointObserver: BreakpointObserver) {}

    public isSmall$ = this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
        .pipe(map(({ matches }) => matches));
}
