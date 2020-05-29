import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';

import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
import { DateValueComponent } from '../../../viewer/values/date-value/date-value.component';
import { JdnDatepickerDirective } from './jdn-datepicker.directive';

describe('JdnDatepickerDirective', () => {
    let component: DateValueComponent;
    let fixture: ComponentFixture<DateValueComponent>;
    let jdnDatepicker: DebugElement;
    let adapter: DateAdapter<JDNConvertibleCalendar>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
            declarations: [DateValueComponent, JdnDatepickerDirective],
            providers: [
                { provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE] }
            ]
        });
        fixture = TestBed.createComponent(DateValueComponent);
        component = fixture.componentInstance;
        jdnDatepicker = fixture.debugElement.query(By.css('jdnDatepicker'));
    });

    it('should create an instance', () => {
        const directive = new JdnDatepickerDirective(adapter);
        expect(directive).toBeTruthy();
    });

});
