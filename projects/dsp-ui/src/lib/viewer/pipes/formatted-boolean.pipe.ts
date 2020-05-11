import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedBoolean'
})
export class FormattedBooleanPipe implements PipeTransform {

  transform(value: boolean, format?: string): string {
    return value ? 'true' : 'false';
  }

}
