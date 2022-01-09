import { Component, Input } from '@angular/core';
import { BlueprintResponse } from '../data-models/blueprint';
import { EntitySource } from '../data-models/entity';
import { LayoutService } from '../shared/layout.service';

@Component({
    selector: 'myth-tools-blueprint[blueprints]',
    templateUrl: './blueprint.component.html',
    styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent {
    @Input()
    public blueprints!: BlueprintResponse[];

    constructor(public readonly layout: LayoutService) {}

    public blueprintTrackBy(_index: number, blueprint: BlueprintResponse) {
        return blueprint.name;
    }

    public entityTrackBy(_index: number, entity: EntitySource) {
        return entity.entity.AssetId;
    }
}
