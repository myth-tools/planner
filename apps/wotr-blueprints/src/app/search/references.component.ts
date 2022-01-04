import { Component, Input } from '@angular/core';
import { Reference } from '../data-models/reference';

@Component({
    selector: 'myth-tools-references[references]',
    templateUrl: './references.component.html',
    styleUrls: ['./references.component.scss']
})
export class ReferencesComponent {
    @Input()
    public references!: Reference[];
}
