import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentModule } from '@myth-tools/web/utils/environment';
import { LayoutModule, StyleModule } from '@myth-tools/wotr/web/feature/core';
import { environment, ENVIRONMENT } from '@myth-tools/wotr/web/utils/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                EnvironmentModule.forRoot({ token: ENVIRONMENT, config: environment }),
                LayoutModule,
                StyleModule
            ],
            declarations: [AppComponent]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app).toBeTruthy();
    });
});
