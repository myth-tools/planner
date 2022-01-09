import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@myth-tools/utils/wotr/environment/ng';
import { Blueprint } from './models/blueprint';

@Injectable({
    providedIn: 'root'
})
export class BlueprintService {
    constructor(@Inject(ENVIRONMENT) private readonly environment: Environment, private readonly http: HttpClient) {}

    public get$() {
        return this.http.get<Blueprint[]>(`/assets/${this.environment.blueprints.outputFileName}.json`);
    }
}
