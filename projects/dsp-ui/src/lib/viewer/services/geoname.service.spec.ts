import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DisplayPlace, GeonameService } from './geoname.service';
import { AppInitService } from '../../core';

const geonamesGetResponse = {
    'timezone': {'gmtOffset': 1, 'timeZoneId': 'Europe/Zurich', 'dstOffset': 2},
    'asciiName': 'Zuerich Enge',
    'astergdem': 421,
    'countryId': '2658434',
    'fcl': 'S',
    'srtm3': 412,
    'adminId2': '6458798',
    'adminId3': '7287650',
    'countryCode': 'CH',
    'adminCodes1': {'ISO3166_2': 'ZH'},
    'adminId1': '2657895',
    'lat': '47.3641',
    'fcode': 'RSTN',
    'continentCode': 'EU',
    'adminCode2': '112',
    'adminCode3': '261',
    'adminCode1': 'ZH',
    'lng': '8.53081',
    'geonameId': 11963110,
    'toponymName': 'Zürich Enge',
    'population': 0,
    'wikipediaURL': 'en.wikipedia.org/wiki/Z%C3%BCrich_Enge_railway_station',
    'adminName5': '',
    'adminName4': '',
    'adminName3': 'Zurich',
    'alternateNames': [{
        'name': '8503010',
        'lang': 'uicn'
    }, {'name': 'https://en.wikipedia.org/wiki/Z%C3%BCrich_Enge_railway_station', 'lang': 'link'}, {
        'name': 'ZEN',
        'lang': 'abbr'
    }, {'isShortName': true, 'isPreferredName': true, 'name': 'Zürich Enge'}],
    'adminName2': 'Zürich District',
    'name': 'Zürich Enge',
    'fclName': 'spot, building, farm',
    'countryName': 'Switzerland',
    'fcodeName': 'railroad station',
    'adminName1': 'Zurich'
};

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
            (displayPlace: DisplayPlace) => {
                expect(displayPlace.displayName).toEqual('Zürich Enge, Zurich, Switzerland');
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const expectedResponse = geonamesGetResponse;

        httpRequest.flush(expectedResponse);

    });

    it('should return an error if the requests fails', done => {

        service.resolveGeonameID('2661604').subscribe(
            name => {
            },
            err => {
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const mockErrorResponse = {status: 400, statusText: 'Bad Request'};

        httpRequest.flush(mockErrorResponse);

    });

    it('should return an error if the requests response does not contain the expected information', done => {

        service.resolveGeonameID('2661604').subscribe(
            name => {
            },
            err => {
                done();
            }
        );

        const httpRequest = httpTestingController.expectOne('https://ws.geonames.net/getJSON?geonameId=2661604&username=token&style=short');

        expect(httpRequest.request.method).toEqual('GET');

        const expectedResponse = {place: 'Basel'};

        httpRequest.flush(expectedResponse);

    });

});
