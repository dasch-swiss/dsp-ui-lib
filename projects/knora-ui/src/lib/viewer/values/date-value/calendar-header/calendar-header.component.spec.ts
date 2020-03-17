import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import {CalendarHeaderComponent} from './calendar-header.component';
import {ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter} from "jdnconvertiblecalendardateadapter";
import {MatSelectModule} from "@angular/material/select";
import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatCalendar, MatDatepickerContent} from "@angular/material/datepicker";
import {BehaviorSubject} from "rxjs";
import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: `mat-calendar-header`,
  template: ``
})
class TestMatCalendarHeaderComponent {

}

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>;
  let fixture: ComponentFixture<CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        BrowserAnimationsModule
      ],
      declarations: [CalendarHeaderComponent, TestMatCalendarHeaderComponent],
      providers: [
        {provide: MatCalendar, useValue: {}},
        {provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter},
        {provide: ACTIVE_CALENDAR, useValue: new BehaviorSubject('Gregorian')},
        {provide: MatDatepickerContent, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the selected value and options correctly', fakeAsync(() => {

    expect(component.formControl.value).toEqual('Gregorian');

    // https://github.com/angular/components/blob/941b5a3529727f583b76068835e07e412e69f4f7/src/material/select/select.spec.ts#L1674-L1692
    component.formControl = new FormControl('Gregorian');
    fixture.detectChanges();

    const compDe = fixture.debugElement;

    const selectValueDebugElement = compDe.query(By.css('.mat-select-value'));

    const selectDebugElement = compDe.query(By.css('.mat-select'));

    expect(selectValueDebugElement.nativeElement.textContent).toEqual('Gregorian');

    const trigger = compDe.query(By.css('.mat-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();
    flush();

    const options: DebugElement[] = selectDebugElement.queryAll(By.css('mat-option'));

    expect(options.length).toEqual(2);

    expect(options[0].nativeElement.innerText).toEqual('Gregorian');

    expect(options[1].nativeElement.innerText).toEqual('Julian');

  }));

});
