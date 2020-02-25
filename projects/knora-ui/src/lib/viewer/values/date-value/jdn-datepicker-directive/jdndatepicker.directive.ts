import {Directive} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {JDNConvertibleCalendar} from 'jdnconvertiblecalendar';
import {JDNConvertibleCalendarDateAdapter} from 'jdnconvertiblecalendardateadapter';

@Directive({
  selector: 'kuiJDNDatepicker',
  providers: [{provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE]}]
})
export class JDNDatepickerDirective {

  constructor(private adapter: DateAdapter<JDNConvertibleCalendar>) {
    console.log(this.adapter)
  }

}
