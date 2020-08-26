import { Pipe, PipeTransform } from '@angular/core';
import { KnoraDate } from '@dasch-swiss/dsp-js';

@Pipe({
    name: 'knoraDate'
})
export class KnoraDatePipe implements PipeTransform {

    formattedString: string;

    transform(date: KnoraDate, format?: string, precisionOptions?: 'era' | 'calendar' | 'all'): string {
        if (!(date instanceof KnoraDate)) {
            console.error('Non-KnoraDate provided. Expected a valid KnoraDate');
            return '';
        }

        switch (format) {
            case 'dd.MM.YYYY':
                this.formattedString = `${this.leftPadding(date.day)}.${this.leftPadding(date.month)}.${date.year}`;
                if (precisionOptions) {
                    return this.addPrecision(date, this.formattedString, precisionOptions);
                } else {
                    return `${this.leftPadding(date.day)}.${this.leftPadding(date.month)}.${date.year}`;
                }
            case 'dd-MM-YYYY':
                this.formattedString = `${this.leftPadding(date.day)}-${this.leftPadding(date.month)}-${date.year}`;
                if (precisionOptions) {
                    return this.addPrecision(date, this.formattedString, precisionOptions);
                } else {
                    return `${this.leftPadding(date.day)}-${this.leftPadding(date.month)}-${date.year}`;
                }
            case 'MM/dd/YYYY':
                this.formattedString = `${this.leftPadding(date.month)}/${this.leftPadding(date.day)}/${date.year}`;
                if (precisionOptions) {
                    return this.addPrecision(date, this.formattedString, precisionOptions);
                } else {
                    return `${this.leftPadding(date.month)}/${this.leftPadding(date.day)}/${date.year}`;
                }
            default:
                return `${this.leftPadding(date.day)}.${this.leftPadding(date.month)}.${date.year}`;
        }
    }

    // ensures that day and month are always two digits
    leftPadding(value: number): string {
        return ('0' + value).slice(-2);
    }

    // add the era, calendar, or both to the result returned by the pipe
    addPrecision(date: KnoraDate, value: string, precision: string): string {
        switch (precision) {
            case 'era':
                return value + ' ' + date.era;
            case 'calendar':
                return value + ' ' + date.calendar;
            case 'all':
                return value + ' ' + date.era + ' ' + date.calendar;
        }
    }

}
