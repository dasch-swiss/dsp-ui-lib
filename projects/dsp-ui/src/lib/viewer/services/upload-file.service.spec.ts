import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppInitService } from '../../core/app-init.service';
import { SessionService } from '../../core/session.service';
import { UploadedFileResponse, UploadFileService } from './upload-file.service';

describe('UploadFileService', () => {
    let service: UploadFileService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    let initServiceSpy: jasmine.SpyObj<AppInitService>;
    let httpClientSpy: { post: jasmine.Spy };
    let sessionServiceSpy: jasmine.SpyObj<SessionService>;

    const file = new File(['1'], 'testfile');
    const mockUploadData = new FormData();
    mockUploadData.append('test', file);

    beforeEach(() => {
        const initSpy = jasmine.createSpyObj('AppInitService', ['config']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        const sessionSpy = jasmine.createSpyObj('SessionService', ['getSession', 'setSession']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppInitService, useValue: initSpy },
                { provide: httpClient, useValue: httpClientSpy },
                { provide: SessionService, useValue: sessionSpy },
            ]
        });
        service = TestBed.inject(UploadFileService);
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);

        initServiceSpy = TestBed.inject(AppInitService) as jasmine.SpyObj<AppInitService>;
        sessionServiceSpy = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should return stubbed value from a spy', () => {
    //     const stubSession = sessionServiceSpy.setSession();
    //     sessionServiceSpy.getSession.and.returnValue(stubSession);
    //     expect(service.upload(mockUploadData)).toBe(stubSession, 'method rerutned stubbed value');
    //     expect(sessionServiceSpy.getSession.calls.count())
    //         .toBe(1, 'spy method was called once');
    // });

    // it('should call the upload()', () => {
    //     service = new UploadFileService(initServiceSpy, httpClientSpy as any, sessionServiceSpy);
    //     expect(service.upload(mockUploadData)).toHaveBeenCalled();
    // });

    // it('should return expected file resposne (HttpClient called once)', () => {
    //     const expectedResponse: UploadedFileResponse = {
    //         uploadedFiles: [{
    //             fileType: 'image',
    //             internalFilename: '8R0cJE3TSgB-BssuQyeW1rE.jp2',
    //             originalFilename: 'Screenshot 2020-10-28 at 14.16.34.png',
    //             temporaryUrl: 'http://sipi:1024/tmp/8R0cJE3TSgB-BssuQyeW1rE.jp2'
    //         }]
    //     };

    //     httpClientSpy.post.and.returnValue((expectedResponse));

    //     service.upload(mockUploadData).subscribe(
    //         res => expect(res).toEqual(expectedResponse, 'expected files response'),
    //         fail
    //     );
    //     expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    // });

    // it('should return an error when the server returns a 404', () => {
    //     const errorResponse = new HttpErrorResponse({
    //         error: 'test 404 error',
    //         status: 404, statusText: 'Not Found'
    //     });

    //     httpClientSpy.post.and.returnValue((errorResponse));

    //     service.upload(mockUploadData).subscribe(
    //         res => fail('expected an error, not files'),
    //         error => expect(error.message).toContain('test 404 error')
    //     );
    // });
});
