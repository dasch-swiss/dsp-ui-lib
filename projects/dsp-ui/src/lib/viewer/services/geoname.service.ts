import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppInitService } from '../../core';

@Injectable({
  providedIn: 'root'
})
export class GeonameService {

  constructor(
      private readonly _http: HttpClient,
      private _appInitService: AppInitService
  ) {
  }

  resolveGeonameID(id: string): Observable<string> {

      return this._http.get<object>('https://ws.geonames.net/getJSON?geonameId=' + id + '&username=' + this._appInitService.config['geonameToken'] + '&style=short').pipe(
          map(
              (geo: { name: string }) => {

                  if (!('name' in geo)) {
                      throw 'no name property';
                  }

                  return geo.name;
              }
          ),
          catchError(error => {
              // an error occurred, just return the id
              return of(id);
          })
      );

  }
}
