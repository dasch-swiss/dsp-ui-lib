import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GeonameService } from './geoname.service';
import { AppInitService } from '../../core';

describe('GeonameService', () => {
    let service: GeonameService;
    let httpTestingController: HttpTestingController;

    const appInitSpy = {
        config: {
            geonameToken: 'token'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: AppInitService,
                    useValue: appInitSpy
                }
            ]
        });

        service = TestBed.inject(GeonameService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should resolve a given geoname id', done => {

        service.resolveGeonameID('2661604').subscribe(
            name => {
                expect(name).toEqual('Basel');
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const expectedResponse = { name: 'Basel' };

        httpRequest.flush(expectedResponse);

    });

    it('should use the given geoname id as a fallback value if the requests fails', done => {

        service.resolveGeonameID('2661604').subscribe(
            name => {
                expect(name).toEqual('2661604');
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const mockErrorResponse = {status: 400, statusText: 'Bad Request'};

        httpRequest.flush(mockErrorResponse);

    });

    it('should use the given geoname id as a fallback value if the requests response does not contain the expected information', done => {

        service.resolveGeonameID('2661604').subscribe(
            name => {
                expect(name).toEqual('2661604');
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const expectedResponse = { place: 'Basel' };

        httpRequest.flush(expectedResponse);

    });

});
