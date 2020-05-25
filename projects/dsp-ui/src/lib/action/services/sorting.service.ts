import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

    constructor() { }

    /**
     * reverses an array
     */
    reverseArray(value: Array<any>): Array<any> {
        if (value) {
            return value.slice().reverse();
        }
    }

    /**
     * compares value by value and sorts by alphabetical order
     */
    sortByAlphabetical(value: Array<any>, args: string): Array<any> {
        if (value instanceof Array) {
            value.sort((a: any, b: any) => {
                if (args) {
                    a[args] = (a[args] === null ? '' : a[args]);
                    b[args] = (b[args] === null ? '' : b[args]);
                    if (a[args].toLowerCase() < b[args].toLowerCase()) {
                        return -1;
                    } else if (a[args].toLowerCase() > b[args].toLowerCase()) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return value;
    }
}
