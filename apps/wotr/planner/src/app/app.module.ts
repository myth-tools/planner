import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EnvironmentModule } from '@myth-tools/web/utils/environment';
import { LayoutModule, StyleModule } from '@myth-tools/wotr/web/feature/core';
import { ENVIRONMENT, environment } from '@myth-tools/wotr/web/utils/environment';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
        EnvironmentModule.forRoot({ token: ENVIRONMENT, config: environment }),
        StyleModule,
        LayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
