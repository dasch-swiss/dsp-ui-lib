import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppInitService } from '../../core/app-init.service';
import { Session, SessionService } from '../../core/session.service';
import { UploadedFileResponse, UploadFileService } from './upload-file.service';

describe('UploadFileService', () => {
    let service: UploadFileService;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;

    let initServiceSpy: jasmine.SpyObj<AppInitService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let sessionServiceSpy: jasmine.SpyObj<SessionService>;

    const file = new File(['1'], 'testfile');
    const mockUploadData = new FormData();
    mockUploadData.append('test', file);

    beforeEach(() => {
        const initSpy = jasmine.createSpyObj('AppInitService', ['config']);
        const httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['post']);
        const sessionSpy = jasmine.createSpyObj('SessionService', ['getSession', 'setSession']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppInitService, useValue: initSpy },
                { provide: HttpClient, useValue: httpClientSpyObj },
                { provide: SessionService, useValue: sessionSpy },
            ]
        });
        service = TestBed.inject(UploadFileService);
        httpTestingController = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        initServiceSpy = TestBed.inject(AppInitService) as jasmine.SpyObj<AppInitService>;
        sessionServiceSpy = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;

        sessionServiceSpy.getSession.and.callFake(
            () => {
                const session: Session = {
                    id: 12345,
                    user: {
                        name: 'username',
                        jwt: 'myToken',
                        lang: 'en',
                        sysAdmin: false,
                        projectAdmin: []
                    }
                };

                return session;
            }
        );
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the upload() method', () => {
        service = new UploadFileService(initServiceSpy, httpClientSpy as any, sessionServiceSpy);
        service.upload(mockUploadData);
        expect(httpClientSpy.post).toHaveBeenCalled();
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });

    it('should return expected file resposne (HttpClient called once)', () => {
        const expectedResponse: UploadedFileResponse = {
            uploadedFiles: [{
                fileType: 'image',
                internalFilename: '8R0cJE3TSgB-BssuQyeW1rE.jp2',
                originalFilename: 'Screenshot 2020-10-28 at 14.16.34.png',
                temporaryUrl: 'http://sipi:1024/tmp/8R0cJE3TSgB-BssuQyeW1rE.jp2'
            }]
        };

        httpClientSpy.post.and.returnValue(of(expectedResponse));

        service.upload(mockUploadData).subscribe(
            res => expect(res).toEqual(expectedResponse, 'expected files response'),
            fail
        );
        expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });
});
