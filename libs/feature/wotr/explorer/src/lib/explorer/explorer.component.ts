import { Component } from '@angular/core';
import { BlueprintService } from '@myth-tools/data-access/wotr/blueprint';
import { tap } from 'rxjs';

@Component({
    selector: 'myth-tools-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {
    public blueprints$ = this.blueprint.get$().pipe(tap(console.log));

    constructor(private readonly blueprint: BlueprintService) {}
}
