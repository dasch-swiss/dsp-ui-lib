import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    NgControl,
    ReactiveFormsModule
} from '@angular/forms';
import { KnoraDate, KnoraPeriod } from '@dasch-swiss/dsp-js';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DateInputTextComponent } from './date-input-text.component';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <div [formGroup]="form">
            <mat-form-field>
                <dsp-date-input-text #dateInputText [formControlName]="'date'"></dsp-date-input-text>
            </mat-form-field>
        </div>`
})
class TestHostComponent implements OnInit {

    @ViewChild('dateInputText') dateInputTextComponent: DateInputTextComponent;

    form: FormGroup;

    constructor(private _fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.form = this._fb.group({
            date: [new KnoraDate('JULIAN', 'CE', 2018, 5, 19)]
        });

    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <div [formGroup]="form">
            <mat-form-field>
                <dsp-date-input-text #dateInputText [formControlName]="'date'"
                                     [valueRequiredValidator]="false"></dsp-date-input-text>
            </mat-form-field>
        </div>`
})
class NoValueRequiredTestHostComponent implements OnInit {

    @ViewChild('dateInputText') dateInputTextComponent: DateInputTextComponent;

    form: FormGroup;

    constructor(private _fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.form = this._fb.group({
            date: new FormControl(null)
        });

    }
}

@Component({
    selector: `dsp-date-edit`,
    template: ``,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => TestDateEditComponent),
        },
        {provide: MatFormFieldControl, useExisting: TestDateEditComponent}
    ]
})

class TestDateEditComponent implements ControlValueAccessor, MatFormFieldControl<any> {

    @Input() value;
    @Input() disabled: boolean;
    @Input() empty: boolean;
    @Input() placeholder: string;
    @Input() required: boolean;
    @Input() shouldLabelFloat: boolean;
    @Input() errorStateMatcher: ErrorStateMatcher;
    @Input() valueRequiredValidator = true;

    @Input() calendar: string;

    errorState = false;
    focused = false;
    id = 'testid';
    ngControl: NgControl | null;
    onChange = (_: any) => {};
    stateChanges = new Subject<void>();

    writeValue(date: KnoraDate | null): void {
        this.value = date;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    onContainerClick(event: MouseEvent): void {
    }

    setDescribedByIds(ids: string[]): void {
    }

    _handleInput(): void {
        this.onChange(this.value);
    }

}

describe('DateInputTextComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let loader: HarnessLoader;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatOptionModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
            ],
            declarations: [DateInputTextComponent, TestDateEditComponent, TestHostComponent, NoValueRequiredTestHostComponent]
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

    it('should initialize a date correctly', async () => {

        expect(testHostComponent.dateInputTextComponent.calendarControl.value).toEqual('JULIAN');

        expect(testHostComponent.dateInputTextComponent.startDate.value).toEqual(new KnoraDate('JULIAN', 'CE', 2018, 5, 19));

        expect(testHostComponent.dateInputTextComponent.isPeriodControl.value).toBeFalse();

        expect(testHostComponent.dateInputTextComponent.endDate.value).toBeNull();

        const hostCompDe = testHostFixture.debugElement;
        const dateEditComponentDe = hostCompDe.query(By.directive(TestDateEditComponent));

        expect((dateEditComponentDe.componentInstance as TestDateEditComponent).calendar).toEqual('JULIAN');

        expect(testHostComponent.dateInputTextComponent.form.valid).toBe(true);

        const calendarSelection = await  loader.getHarness(MatSelectHarness.with({selector: '.calendar-selection'}));
        expect(await calendarSelection.getValueText()).toEqual('JULIAN');

        const periodCheckbox = await loader.getHarness(MatCheckboxHarness.with({selector: '.period-checkbox'}));
        expect(await periodCheckbox.getValue()).toEqual('on');

        expect(testHostComponent.dateInputTextComponent.value instanceof KnoraDate).toBe(true);

        expect(testHostComponent.dateInputTextComponent.value)
            .toEqual(new KnoraDate('JULIAN', 'CE', 2018, 5, 19));

    });

});
