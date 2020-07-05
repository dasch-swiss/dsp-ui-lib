import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateValueComponent } from './search-date-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { CalendarDate, CalendarPeriod, GregorianCalendarDate, JDNPeriod } from 'jdnconvertiblecalendar';
import { ValueLiteral } from '../operator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DspViewerModule } from '../../../../../viewer';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-search-date-value #dateVal [formGroup]="form"></dsp-search-date-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('dateVal', {static: false}) dateValue: SearchDateValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

describe('SearchDateValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatInputModule,
                MatDatepickerModule,
                DspViewerModule // needed because of DatePicker directive and calendar header
            ],
            declarations: [
                SearchDateValueComponent,
                TestHostComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);

        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.dateValue).toBeTruthy();
    });

    it('should get a date', () => {

        const calDate = new CalendarDate(2018, 10, 30);
        testHostComponent.dateValue.form.controls['dateValue'].setValue(new GregorianCalendarDate(new CalendarPeriod(calDate, calDate)));

        const gregorianDate = new ValueLiteral('GREGORIAN:2018-10-30:2018-10-30', 'http://api.knora.org/ontology/knora-api/simple/v2#Date');

        const dateVal = testHostComponent.dateValue.getValue();

        expect(dateVal).toEqual(gregorianDate);

    });
});
