import { Pipe, PipeTransform } from '@angular/core';
import { KnoraDate } from '@knora/api';

@Pipe({
  name: 'knoraDate'
})
export class KnoraDatePipe implements PipeTransform {

  // TODO: use the optional format parameter and return a string with that format
  transform(value: KnoraDate, format?: string): string {
    let formattedDate: Date = new Date();

    // js date month is 0-based, so subtract 1
    formattedDate.setFullYear(value.year, (value.month - 1), value.day);

    let dateStr = formattedDate.toLocaleDateString();

    return dateStr;
  }

}