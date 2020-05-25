import { Pipe, PipeTransform } from '@angular/core';

/**
 * @deprecated
 * Please make use of the new sorting service and sort arrays in the class instead of in the template.
 */

@Pipe({
    name: 'dspReverse'
})
export class ReversePipe implements PipeTransform {

    /**
     * reverses an array
     */

    transform(value: any): any {
        if (value) {
            return value.slice().reverse();
        }
    }

}
