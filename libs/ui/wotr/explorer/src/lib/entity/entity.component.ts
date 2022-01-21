import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

@Component({
    selector: 'myth-tools-entity[entity]',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnChanges {
    @ViewChild('guid', { static: true })
    public guidTemplate!: TemplateRef<{ id: string }>;

    @ViewChild('part', { static: true })
    public partTemplate!: TemplateRef<{ text: string }>;

    @ViewChild('code', { read: ViewContainerRef, static: true })
    public code!: ViewContainerRef;

    @Input()
    public entity!: string;

    @Output()
    public reference = new EventEmitter<string>();

    private guidRegex = new RegExp(
        /(\{{0,1}[0-9a-fA-F]{8}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{12}\}{0,1})/
    );

    /* public ngOnInit(): void {
        const parts = this.entity.split(this.guidRegex);

        parts.forEach((part, index) => {
            if (!this.guidTemplate || !this.partTemplate) {
                return;
            }

            if (this.isGuid(part)) {
                this.code.createEmbeddedView(this.guidTemplate, { id: part }, index);
            } else {
                this.code.createEmbeddedView(this.partTemplate, { text: part }, index);
            }
        });
    } */

    public ngOnChanges(): void {
        this.code.clear();

        const parts = this.entity.split(this.guidRegex);

        parts.forEach((part, index) => {
            if (!this.guidTemplate || !this.partTemplate) {
                return;
            }

            if (this.isGuid(part)) {
                this.code.createEmbeddedView(this.guidTemplate, { id: part }, index);
            } else {
                this.code.createEmbeddedView(this.partTemplate, { text: part }, index);
            }
        });
    }

    public onReference(event: string) {
        this.reference.emit(event);
    }

    private isGuid(str: string) {
        return this.guidRegex.test(str);
    }
}
