import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Blueprint } from '@myth-tools/wotr/explorer/model/blueprint';
import { ENVIRONMENT, Environment } from '@myth-tools/wotr/web/utils/environment';

@Injectable({ providedIn: 'root' })
export class BlueprintService {
    constructor(@Inject(ENVIRONMENT) private readonly environment: Environment, private readonly http: HttpClient) {}

    public get$() {
        return this.http.get<Blueprint[]>(`/assets/${this.environment.blueprints.outputFileName}.json`);
    }
}
