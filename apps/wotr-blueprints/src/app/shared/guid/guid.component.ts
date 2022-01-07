import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'myth-tools-guid',
    templateUrl: './guid.component.html',
    styleUrls: ['./guid.component.scss']
})
export class GuidComponent implements OnInit {
    @ViewChild('guid', { static: true })
    public guidTemplate?: TemplateRef<any>;

    @ViewChild('part', { static: true })
    public partTemplate?: TemplateRef<any>;

    @ViewChild('code', { read: ViewContainerRef, static: true })
    public target!: ViewContainerRef;

    @Input()
    public jsonString!: string;

    private guidRegex = new RegExp(
        /(\{{0,1}[0-9a-fA-F]{8}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{4}-*[0-9a-fA-F]{12}\}{0,1})/
    );

    constructor(private vcr: ViewContainerRef) {}

    ngOnInit(): void {
        const parts = this.jsonString.split(this.guidRegex);

        parts.forEach((part, index) => {
            if (!this.guidTemplate || !this.partTemplate) {
                return;
            }

            if (this.isGuid(part)) {
                // this.guidTemplate.createEmbeddedView({ guid: part });
                // this.templateRef.createEmbeddedView();
                this.target.createEmbeddedView(this.guidTemplate, { tt: part }, index);
            } else {
                this.target.createEmbeddedView(this.partTemplate, { tt: part }, index);
            }
        });
    }

    /* ngAfterViewInit(): void {
        const parts = this.jsonString.split(this.guidRegex);

        parts.forEach((part, index) => {
            if (!this.guidTemplate || !this.partTemplate) {
                return;
            }

            if (this.isGuid(part)) {
                // this.guidTemplate.createEmbeddedView({ guid: part });
                // this.templateRef.createEmbeddedView();
                this.target.createEmbeddedView(this.guidTemplate, { tt: part }, index);
            } else {
                this.target.createEmbeddedView(this.partTemplate, { tt: part }, index);
            }
        });
    } */

    /* ngAfterViewInit(): void {
        if (!this.guidTemplate || !this.partTemplate) {
            return;
        }

        const parts = this.jsonString.split(this.guidRegex);

        for (const part of parts) {
            if (this.isGuid(part)) {
                this.vcr.createEmbeddedView(this.guidTemplate, { $implicit: { guid: part } });
            } else {
                this.vcr.createEmbeddedView(this.partTemplate, { $implicit: { part } });
            }
        }
    } */

    public test() {
        console.log('test');
    }

    private isGuid(str: string) {
        return this.guidRegex.test(str);
    }
}
