import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../environments/environment';
import { Entity } from '../data-models/entity';
import { BlueprintService } from '../shared/blueprint.service';

interface JsonHash {
    name: string;
    assetId: string;
    hashString: string;
    hash: Entity;
}

interface Reference {
    entity: Entity;
    name: string;
}

interface Result {
    name?: string;
    entity?: Entity;
    references: Reference[];
}

@Component({
    selector: 'myth-tools-result[search]',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnChanges {
    @Input()
    public search!: string;

    public name? = '';
    public entity?: Entity;
    public references: Reference[] = [];

    public isExpanded = false;

    private jsonHash: JsonHash[] = [];

    constructor(private readonly blueprint: BlueprintService) {
        for (const [assetId, hash] of this.blueprint.hash.entries()) {
            this.jsonHash.push({
                assetId,
                name: this.toEntityName(hash.name),
                hash: hash.entity.entity,
                hashString: JSON.stringify(hash.entity)
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.isExpanded = false;

        const { name, entity, references } = this.getResult(changes['search'].currentValue);

        this.name = name;
        this.entity = entity;
        this.references = references;
    }

    public referencesTrackBy(_index: number, entity: Entity) {
        return entity.AssetId;
    }

    private getResult(search: string) {
        const references: Reference[] = [];
        const entityHash = this.blueprint.hash.get(search);

        if (entityHash) {
            for (const { assetId, name, hash, hashString } of this.jsonHash) {
                if (hashString.includes(this.search) && assetId !== this.search) {
                    references.push({ name, entity: hash });
                }
            }
        }

        const result: Result = {
            name: this.toEntityName(entityHash?.name),
            entity: entityHash?.entity.entity,
            references
        };

        return result;
    }

    private toEntityName(name: string): string;
    private toEntityName(name?: string): undefined;
    private toEntityName(name?: string): string | undefined {
        return name?.replace(`\\${environment.indexFileName}.json`, '');
    }
}
