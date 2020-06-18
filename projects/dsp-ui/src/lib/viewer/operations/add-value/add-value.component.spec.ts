import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValueComponent } from './add-value.component';
import { DspApiConnectionToken } from '../../../core';
import { ReadResource, ReadValue, MockResource } from '@dasch-swiss/dsp-js';
import { ViewChild, Component, OnInit } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `dsp-add-value-host-component`,
    template: `
      <dsp-add-value *ngIf="readValue" #addVal [parentResource]="readResource"
                        [displayValue]="readValue"></dsp-add-value>`
  })
class DspAddValueTestComponent implements OnInit {

    @ViewChild('addVal') addValueComponent: AddValueComponent;

    readResource: ReadResource;
    readValue: ReadValue;

    mode: 'read' | 'update' | 'create' | 'search';

    ngOnInit() {

        MockResource.getTestthing().subscribe(res => {
            this.readResource = res;

            this.mode = 'read';
        });
    }

    // assigns a value when called -> dsp-add-value will be instantiated
    assignValue(prop: string, comment?: string) {
        const readVal = this.readResource.getValues(prop)[0];

        readVal.userHasPermission = 'M';

        readVal.valueHasComment = comment;
        this.readValue = readVal;
    }
}

describe('AddValueComponent', () => {
    let testHostComponent: DspAddValueTestComponent;
    let testHostFixture: ComponentFixture<DspAddValueTestComponent>;

    beforeEach(async(() => {

        const valuesSpyObj = {
            v2: {
                values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                AddValueComponent
            ],
            providers: [
                {
                provide: DspApiConnectionToken,
                useValue: valuesSpyObj
                }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(DspAddValueTestComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
