import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentModule } from '@myth-tools/web/utils/environment';
import { environment, ENVIRONMENT } from '@myth-tools/wotr/web/utils/environment';
import { FirebaseService } from './firebase.service';
import { DynamicLinkRequest } from './models/dynamic-link-request';
import { DynamicLinkResponse } from './models/dynamic-link-response';

describe('FirebaseService', () => {
    let sut: FirebaseService;
    let httpClient: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnvironmentModule.forRoot({ token: ENVIRONMENT, config: environment }), HttpClientTestingModule],
            providers: [FirebaseService]
        }).compileComponents();

        sut = TestBed.inject(FirebaseService);
        httpClient = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpClient.verify();
    });

    it('should be defined', () => {
        expect(sut).toBeDefined();
    });

    it('should create a dynamic link', () => {
        const link = `https://wotr.myth-tools.com/123`;
        const suffix = 'UNGUESSABLE';

        const expected: DynamicLinkResponse = {
            previewLink: 'https://wotr.myth-tools.com/123',
            shortLink: 'https://short-url.myth-tools.com/123'
        };

        const body: DynamicLinkRequest = {
            dynamicLinkInfo: {
                link,
                domainUriPrefix: sut['environment'].firebase.prefix
            },
            suffix: { option: suffix }
        };

        sut.createDynamicLink$(`https://wotr.myth-tools.com/123`, 'UNGUESSABLE').subscribe(result => {
            expect(result).toEqual(expected);
        });

        const request = httpClient.expectOne(
            `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${sut['environment'].firebase.apiKey}`
        );

        expect(request.request.method).toEqual('POST');
        expect(request.request.body).toEqual(body);

        request.flush(expected);
    });
});
