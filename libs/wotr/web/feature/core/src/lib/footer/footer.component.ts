import { Component, Inject } from '@angular/core';
import { Environment, ENVIRONMENT } from '@myth-tools/wotr/web/utils/environment';

@Component({
    selector: 'myth-tools-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    constructor(@Inject(ENVIRONMENT) public readonly environment: Environment) {}
}
