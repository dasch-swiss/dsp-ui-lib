import { Pipe, PipeTransform } from '@angular/core';
import { KnoraDate } from '@dasch-swiss/dsp-js';

@Pipe({
    name: 'knoraDate'
})
export class KnoraDatePipe implements PipeTransform {

    transform(date: KnoraDate, format?: string): string {
        if (!(date instanceof KnoraDate)) {
            console.error('Non-KnoraDate provided. Expected a valid KnoraDate');
            return '';
        }

        switch (format) {
            case 'dd.MM.YYYY':
                return `${this.leftPadding(date.day)}.${this.leftPadding(date.month)}.${date.year}`;
            case 'dd-MM-YYYY':
                return `${this.leftPadding(date.day)}-${this.leftPadding(date.month)}-${date.year}`;
            case 'MM/dd/YYYY':
                return `${this.leftPadding(date.month)}/${this.leftPadding(date.day)}/${date.year}`;
            default:
                return `${this.leftPadding(date.day)}.${this.leftPadding(date.month)}.${date.year}`;
        }
    }

    // ensures that day and month are always two digits
    leftPadding(value: number): string {
        return ('0' + value).slice(-2);
    }

}
