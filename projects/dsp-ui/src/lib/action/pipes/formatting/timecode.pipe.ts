import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'util';

/**
 * The TimeCode pipe transforms
 * n seconds to hh:mm:ss
 * or in case of zero hours to mm:ss
 *
 * OR hh:mm:ss to seconds
 */
@Pipe({
  name: 'timecode'
})
export class TimecodePipe implements PipeTransform {

  transform(value: number | string): string | number {
    if (typeof value === 'number') {
        const dateObj: Date = new Date(value * 1000);
        const hours: number = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getSeconds();

        if (hours === 0) {
            return minutes.toString().padStart(2, '0') + ':' +
                seconds.toString().padStart(2, '0');
        } else {
            return hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0') + ':' +
                seconds.toString().padStart(2, '0');
        }
    } else if (typeof value === 'string') {
        const timecode = value.split(':');
        console.log('timecode', timecode);
    }


    return null;
  }

}
