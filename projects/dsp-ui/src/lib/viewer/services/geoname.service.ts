import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeonameService {

  constructor(private readonly _http: HttpClient) {
  }

  resolveGeonameID(id: string): Observable<string> {

      return this._http.get<object>('https://ws.geonames.net/getJSON?geonameId=' + id + '&username=knora&style=long').pipe(
          map(
              (geo: { name: string }) => {

                  if (!('name' in geo)) {
                      throw 'no name property';
                  }

                  return geo.name;
              }
          ),
          catchError(error => {
              return throwError('Geoname service error: ' + error);
          })
      );

  }
}
