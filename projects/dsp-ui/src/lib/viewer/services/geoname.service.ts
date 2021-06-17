import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';
import { AppInitService } from '../../core/app-init.service';

export interface GIS {
    longitude: number;
    latitude: number;
}

export interface DisplayPlace {
    displayName: string;
    name: string;
    country: string;
    administrativeName?: string;
    wikipediaUrl?: string;
    location: GIS;
}

@Injectable({
  providedIn: 'root'
})
export class GeonameService {

  constructor(
      private readonly _http: HttpClient,
      private _appInitService: AppInitService
  ) {
  }

  resolveGeonameID(id: string): Observable<DisplayPlace> {

      return this._http.get<object>('https://ws.geonames.net/getJSON?geonameId=' + id + '&username=' + this._appInitService.config['geonameToken'] + '&style=short').pipe(
          map(
              (geo: { name: string, countryName: string, adminName1: string, wikipediaURL?: string, lat: number, lng: number }) => {

                  if (!(('name' in geo) && ('countryName' in geo) && ('adminName1' in geo) && ('lat' in geo) && ('lng' in geo))) {
                      throw 'required property missing in geonames response';
                  }

                  return {
                      displayName: geo.name + ', ' + geo.adminName1 + ', ' + geo.countryName,
                      name: geo.name,
                      administrativeName: geo.adminName1,
                      country: geo.countryName,
                      wikipediaUrl: geo.wikipediaURL,
                      location: {
                          longitude: geo.lng,
                          latitude: geo.lat
                      }
                  };
              }
          ),
          share(), // several subscribers may use the same source Observable (one HTTP request to geonames)
          catchError(error => {
              // an error occurred
              return throwError(error);
          })
      );

  }
}
