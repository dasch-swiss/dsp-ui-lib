import { Pipe, PipeTransform } from '@angular/core';
import { KnoraDate } from '@knora/api';

@Pipe({
    name: 'knoraDate'
})
export class KnoraDatePipe implements PipeTransform {

    // TODO: use the optional format parameter and return a string with that format
    transform(value: KnoraDate, format?: string): string {
        if (!(value instanceof KnoraDate)) {
            console.error('Non-KnoraDate provided. Expected a valid KnoraDate');
            return '';
        }

        if (value == null) {
            console.error('Value is null. Expected a valid KnoraDate');
            return '';
        }

        const formattedDate: Date = new Date();

        // js date month is 0-based, so subtract 1
        formattedDate.setFullYear(value.year, (value.month - 1), value.day);

        const dateStr = formattedDate.toLocaleDateString();

        return dateStr;
    }

}
