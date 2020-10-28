import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../../core';

interface UploadedFile {
    fileType: string;
    internalFilename: string;
    originalFilename: string;
    temporaryUrl: string;
}

export interface UploadedFileResponse {
    uploadedFiles: UploadedFile[];
}

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

    session: Session;

    constructor(
        // @Inject(DspApiConfigToken) private _apiToken: KnoraApiConnection,
        private http: HttpClient
        // private _ss: SessionService
    ) { }

    upload(file: FormData): Observable<any> {
        // TODO add env variable from AppInitService.config
        const baseUrl = 'http://localhost:1024/upload';
        const jwt = this.getSession().user.jwt;
        const params = new HttpParams().set('token', jwt);
        const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // TODO
        // TODO in order to track the progress change below to true and 'events'
        const options = { params, reportProgress: false, observe: 'body' as 'body', headers};
        const message = 'SUCCESS: Representation uploaded succesfully';
        return this.http.post<any>(baseUrl, file, options);

        // console.log('upload', message, JSON.stringify(data));
    }

    getSession(): Session {
        return JSON.parse(localStorage.getItem('session'));
    }
}
