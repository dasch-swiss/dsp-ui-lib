import {Directive, Host, Inject} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {JDNConvertibleCalendar} from 'jdnconvertiblecalendar';
import {ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter} from 'jdnconvertiblecalendardateadapter';
import {DateInputComponent} from '../date-input/date-input.component';

@Directive({
  selector: 'kuiJDNDatepicker',
  providers: [
    {provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE, ACTIVE_CALENDAR]},
    {provide: ACTIVE_CALENDAR, useValue: 'Gregorian'}
  ]
})
export class JDNDatepickerDirective {

  constructor(@Host() dateInput: DateInputComponent, @Inject(ACTIVE_CALENDAR) activeCalendar, private adapter: DateAdapter<JDNConvertibleCalendar>) {
  }

}
