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

export interface SearchPlace {
    id: string;
    displayName: string;
    name: string;
    administrativeName?: string;
    country: string;
    locationType: string;
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
                (geo: { name: string, countryName: string, adminName1?: string, wikipediaURL?: string, lat: number, lng: number }) => {

                    if (!(('name' in geo) && ('countryName' in geo) && ('lat' in geo) && ('lng' in geo))) {
                        throw 'required property missing in geonames response';
                    }

                    return {
                        displayName: geo.name + (geo.adminName1 !== undefined ? ', ' + geo.adminName1 : '') + ', ' + geo.countryName,
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

    searchPlace(searchString: string): Observable<SearchPlace[]> {

        return this._http.get<object>('https://ws.geonames.net/searchJSON?userName=' + this._appInitService.config['geonameToken'] + '&lang=de&style=full&maxRows=12&name_startsWith=' + encodeURIComponent(searchString)).pipe(
            map(
                (places: {
                    geonames: { geonameId: string, name: string, countryName: string, adminName1?: string, fclName: string }[]
                }) => {

                    if (!Array.isArray(places.geonames)) {
                        throw 'search did not return an array of results';
                    }

                    return places.geonames.map(
                        geo => {

                            if (!(('geonameId' in geo) && ('name' in geo) && ('countryName' in geo) && ('fclName' in geo))) {
                                throw 'required property missing in geonames response';
                            }

                            return {
                                id: geo.geonameId,
                                displayName: geo.name + (geo.adminName1 !== undefined ? ', ' + geo.adminName1 : '') + ', ' + geo.countryName,
                                name: geo.name,
                                administrativeName: geo.adminName1,
                                country: geo.countryName,
                                locationType: geo.fclName
                            };
                        }
                    );

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
