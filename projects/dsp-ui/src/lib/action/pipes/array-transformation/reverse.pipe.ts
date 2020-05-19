import { Pipe, PipeTransform } from '@angular/core';

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
