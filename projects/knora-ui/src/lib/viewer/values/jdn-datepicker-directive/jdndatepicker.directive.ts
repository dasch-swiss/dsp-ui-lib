import {Directive, Host, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
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

  private _activeCalendar: 'Gregorian' | 'Julian' | 'Islamic';

  @Input()
  set activeCalendar(value: 'Gregorian' | 'Julian' | 'Islamic' | null) {
    if (value !== null && value !== undefined) {
      this._activeCalendar = value;
    } else {
      this._activeCalendar = 'Gregorian';
    }
  }

  get activeCalendar() {
    return this._activeCalendar;
  }

  constructor(@Inject(ACTIVE_CALENDAR) private activeCalendarToken, private adapter: DateAdapter<JDNConvertibleCalendar>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, this.activeCalendarToken.getValue())
    this.activeCalendarToken.next(this.activeCalendar);
  }

}
