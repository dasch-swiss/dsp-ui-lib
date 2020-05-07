import { Pipe, PipeTransform } from '@angular/core';
import { KnoraDate } from '@knora/api';

@Pipe({
    name: 'knoraDate'
})
export class KnoraDatePipe implements PipeTransform {

    // TODO: use the optional format parameter and return a string with that format
    transform(date: KnoraDate, format?: string): string {
        if (!(date instanceof KnoraDate)) {
            console.error('Non-KnoraDate provided. Expected a valid KnoraDate');
            return '';
        }

        if (!date) {
            console.error('Value is null. Expected a valid KnoraDate');
            return '';
        }

        // make this fancier
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
        return ('00' + value).slice(-2);
    }

}
