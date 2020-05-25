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
        if (value instanceof Array) {
            return value.slice().reverse();
        }
    }

    /**
     * compares value by value and sorts by alphabetical order
     * optionally, you can have the array returned to you in reversed order by providing the 'reversed' parameter to the method call
     */
    sortByAlphabetical(value: Array<any>, args: string, reversed?: boolean): Array<any> {
        if (value instanceof Array) {
            value.sort((a: any, b: any) => {
                if (args) {
                    a[args] = (a[args] === null ? '' : a[args]);
                    b[args] = (b[args] === null ? '' : b[args]);
                    if (a[args].toLowerCase() < b[args].toLowerCase()) {
                        return reversed ? 1 : -1;
                    } else if (a[args].toLowerCase() > b[args].toLowerCase()) {
                        return reversed ? -1 : 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return value;
    }
}
