import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { BlueprintService } from './shared/blueprint.service';
import { LayoutService } from './shared/layout.service';

@Component({
    selector: 'myth-tools-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public isLoading = true;
    public search = '';

    constructor(public readonly layout: LayoutService, private readonly blueprint: BlueprintService) {}

    public getBlueprints$ = this.blueprint.get$().pipe(tap({ finalize: () => (this.isLoading = false) }));

    public onSearch(search: string) {
        this.search = search;
    }
}
