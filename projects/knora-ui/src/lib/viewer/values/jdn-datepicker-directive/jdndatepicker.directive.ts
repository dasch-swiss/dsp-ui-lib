import {Directive, Host, Inject, Input, OnChanges} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {JDNConvertibleCalendar} from 'jdnconvertiblecalendar';
import {ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter} from 'jdnconvertiblecalendardateadapter';
import {DateInputComponent} from '../date-value/date-input/date-input.component';
import {BehaviorSubject} from 'rxjs';

export function makeCalendarToken() {
  return new BehaviorSubject('Gregorian');
}

@Directive({
  selector: 'kui-jdn-datepicker',
  providers: [
    {provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE, ACTIVE_CALENDAR]},
    {provide: ACTIVE_CALENDAR, useFactory: makeCalendarToken}
  ]
})
export class JDNDatepickerDirective implements OnChanges {

  @Input() activeCalendar: 'Gregorian' | 'Julian' | 'Islamic';

  constructor(@Inject(ACTIVE_CALENDAR) private activeCalendarToken, private adapter: DateAdapter<JDNConvertibleCalendar>) {
  }

  ngOnChanges(): void {
    this.activeCalendarToken.next(this.activeCalendar);
  }

}
