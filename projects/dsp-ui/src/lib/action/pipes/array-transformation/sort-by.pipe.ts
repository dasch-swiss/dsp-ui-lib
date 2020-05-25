import { Pipe, PipeTransform } from '@angular/core';

/**
 * @deprecated
 * Please make use of the new sorting service and sort arrays in the class instead of in the template.
 */

@Pipe({
    name: 'dspSortBy'
})
export class SortByPipe implements PipeTransform {

    /**
     * compares value by value and sorts by alphabetical order
     */
    transform(array: Array<any>, args: string): Array<any> {
        if (array !== undefined) {
            array.sort((a: any, b: any) => {
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
        return array;
    }
}
