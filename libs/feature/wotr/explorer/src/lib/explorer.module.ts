import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlueprintModule } from '@myth-tools/data-access/wotr/blueprint';
import { ExplorerComponent } from './explorer/explorer.component';

@NgModule({
    declarations: [ExplorerComponent],
    imports: [
        CommonModule,
        BlueprintModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ExplorerComponent
            }
        ])
    ]
})
export class ExplorerModule {}
