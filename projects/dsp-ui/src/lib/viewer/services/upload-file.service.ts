import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInitService } from '../../core/app-init.service';
import { SessionService } from '../../core/session.service';

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

    envUrl: string = this._is.config[`sipiUrl`];

    constructor(
        private readonly _is: AppInitService,
        private readonly _http: HttpClient,
        private readonly _ss: SessionService
    ) { }

    upload(file: FormData): Observable<any> {
        const baseUrl = `${this.envUrl}upload`;
        const jwt = this._ss.getSession().user.jwt;
        const params = new HttpParams().set('token', jwt);
        const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // TODO
        // TODO in order to track the progress change below to true and 'events'
        const options = { params, reportProgress: false, observe: 'body' as 'body', headers};
        console.log(`Uploaded to: ${baseUrl}`);
        return this._http.post<any>(baseUrl, file, options);
    }
}
