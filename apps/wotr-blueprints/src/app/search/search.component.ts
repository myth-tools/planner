import { Component, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged, iif, mergeMap, of } from 'rxjs';

@Component({
    selector: 'myth-tools-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    public searchFormControl = new FormControl('', Validators.minLength(10));

    @Output()
    public search = this.searchFormControl.valueChanges.pipe(
        distinctUntilChanged(),
        mergeMap(value => iif(() => !value || value.length >= 10, of(value), of('')))
    );
}
