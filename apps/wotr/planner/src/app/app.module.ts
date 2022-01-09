import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@myth-tools/ui/shared';
import { EnvironmentModule } from '@myth-tools/utils/wotr/environment/ng';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
        EnvironmentModule.forRoot(),
        LayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
