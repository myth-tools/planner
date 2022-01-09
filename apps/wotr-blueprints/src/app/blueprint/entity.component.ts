import { Component, Input } from '@angular/core';
import { Entity } from '../data-models/entity';

@Component({
    selector: 'myth-tools-entity[entity]',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent {
    @Input()
    public entity!: Entity;
}
