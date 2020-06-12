import { Injectable } from '@angular/core';

interface StringArray {
    [index: string]: string;
}

@Injectable({
    providedIn: 'root'
})
export class SortingService {

    constructor() { }

    /**
     * reverses an array
     */
    reverseArray(value: Array<any>): Array<any> {
        return value.slice().reverse();
    }

    /**
     * compares value by value and sorts in alphabetical order using the provided key
     * optionally, you can have the array returned to you in reversed order by setting the reversed parameter to 'true'
     */
    keySortByAlphabetical<T extends StringArray>(value: Array<T>, sortKey: keyof T, reversed = false): Array<T> {
        const sortedArray = value.slice();
        sortedArray.sort((a: T, b: T) => {
            if (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) {
                return -1;
            } else if (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });
        if (reversed) {
            sortedArray.reverse();
        }
        return sortedArray;
    }
}
