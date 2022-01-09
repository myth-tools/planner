import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ExplorerModule } from '@myth-tools/feature/wotr/explorer';
import { LayoutModule } from '@myth-tools/ui/shared';
import { EnvironmentModule } from '@myth-tools/utils/wotr/environment/ng';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    pathMatch: 'full',
                    loadChildren: () =>
                        import('@myth-tools/feature/wotr/explorer').then(module => module.ExplorerModule)
                }
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
        EnvironmentModule.forRoot(),
        LayoutModule,
        ExplorerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
