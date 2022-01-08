import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@myth-tools/ui/shared';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }), LayoutModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
