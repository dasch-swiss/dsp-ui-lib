import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateEditComponent } from './date-edit.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KnoraDate } from '@dasch-swiss/dsp-js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <div [formGroup]="form">
            <mat-form-field>
                <dsp-date-edit #dateEdit [formControlName]="'date'" [calendar]="calendar"></dsp-date-edit>
            </mat-form-field>
        </div>`
})
class TestHostComponent implements OnInit {

    @ViewChild('dateEdit') dateEditComponent: DateEditComponent;

    form: FormGroup;

    calendar = 'JULIAN';

    constructor(private _fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.form = this._fb.group({
            date: [new KnoraDate('JULIAN', 'CE', 2018, 5, 19)]
        });

    }
}

describe('DateEditComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let loader: HarnessLoader;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatRadioModule,
                BrowserAnimationsModule,
                MatSelectModule
            ],
            declarations: [DateEditComponent, TestHostComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should initialize a date with day precision correctly', async () => {

        expect(testHostComponent.dateEditComponent.calendar).toEqual('JULIAN');

        expect(testHostComponent.dateEditComponent.yearControl.value).toEqual(2018);
        expect(testHostComponent.dateEditComponent.monthControl.value).toEqual(5);
        expect(testHostComponent.dateEditComponent.dayControl.value).toEqual(19);

        const yearInput = await loader.getHarness(MatInputHarness.with({selector: '.year'}));
        expect(await yearInput.getValue()).toEqual('2018');

        const monthInput = await loader.getHarness(MatSelectHarness.with({selector: '.month'}));
        expect(await monthInput.getValueText()).toEqual('5');

        const dayInput = await loader.getHarness(MatSelectHarness.with({selector: '.day'}));
        expect(await dayInput.getValueText()).toEqual('19');

    });

    it('should initialize a date with month precision correctly', async () => {

        testHostComponent.form.controls.date.setValue(new KnoraDate('JULIAN', 'CE', 2018, 5));

        expect(testHostComponent.dateEditComponent.calendar).toEqual('JULIAN');

        expect(testHostComponent.dateEditComponent.yearControl.value).toEqual(2018);
        expect(testHostComponent.dateEditComponent.monthControl.value).toEqual(5);
        expect(testHostComponent.dateEditComponent.dayControl.value).toEqual(null);

        const yearInput = await loader.getHarness(MatInputHarness.with({selector: '.year'}));
        expect(await yearInput.getValue()).toEqual('2018');

        const monthInput = await loader.getHarness(MatSelectHarness.with({selector: '.month'}));
        expect(await monthInput.getValueText()).toEqual('5');

        const dayInput = await loader.getHarness(MatSelectHarness.with({selector: '.day'}));

        expect(await dayInput.getValueText()).toEqual('');

    });

});

