import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'myth-tools-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public readonly release = environment.release;
    public readonly version = environment.game.version;
}
