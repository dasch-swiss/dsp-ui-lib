import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Size {
    'width': number;
    'height': number;
}
export interface Profile {
    'formats': [string];
    'qualities': [string];
    'supports': [string];
}

export interface SipiImageInfo {
    '@context': string;
    '@id': string;
    'protocol': string;
    'width': number;
    'height': number;
    'sizes': [Size];
    'profile': (string | Profile)[];
}

@Injectable({
    providedIn: 'root'
})
export class MovingImagePreviewService {

    constructor(
        private _http: HttpClient
    ) { }

    /**
     * Returns sipi image information about the matrix file
     *
     * @param matrix url to matrix file
     */
    getMatrixInfo(matrix: string): Observable<SipiImageInfo> {
        return this._http.get<SipiImageInfo>(matrix)
            .pipe(
                catchError(this.handleError<any>('getMovingImagePreviewInfo', {}))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: better job of transforming error for user consumption
            console.error(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
