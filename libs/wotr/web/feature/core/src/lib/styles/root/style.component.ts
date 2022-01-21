import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'myth-tools-style',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StyleComponent {}
