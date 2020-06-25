import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateIntValue, CreateValue, MockResource, ReadIntValue, ReadResource, ResourcePropertyDefinition, ValuesEndpointV2, WriteValueResponse } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { DspApiConnectionToken } from '../../../core';
import { AddValueComponent } from './add-value.component';

@Component({
    selector: `dsp-int-value`,
    template: ``
  })
class TestIntValueComponent implements OnInit {

    @Input() mode;

    @Input() displayValue;

    form: object;

    ngOnInit(): void {

        this.form = new FormGroup({
            test: new FormControl(null, [Validators.required])
        });
    }

    getNewValue(): CreateValue {
        const createIntVal = new CreateIntValue();

        createIntVal.int = 1;

        return createIntVal;
    }

    updateCommentVisibility(): void { }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `dsp-add-value-host-component`,
    template: `
      <dsp-add-value #testAddVal [resourcePropertyDefinition]="resourcePropertyDefinition" [parentResource]="readResource"></dsp-add-value>`
  })
class DspAddValueTestComponent implements OnInit {

    @ViewChild('testAddVal') testAddValueComponent: AddValueComponent;

    readResource: ReadResource;
    resourcePropertyDefinition: ResourcePropertyDefinition;

    ngOnInit() {

        MockResource.getTestthing().subscribe(res => {
            this.readResource = res;
        });

        this.resourcePropertyDefinition = this.readResource.entityInfo.getAllPropertyDefinitions()[9] as ResourcePropertyDefinition;
    }

}

describe('AddValueComponent', () => {
    let testHostComponent: DspAddValueTestComponent;
    let testHostFixture: ComponentFixture<DspAddValueTestComponent>;

    beforeEach(async(() => {

        const valuesSpyObj = {
            v2: {
                values: jasmine.createSpyObj('values', ['createValue', 'getValue'])
            }
        };

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatIconModule,
            ],
            declarations: [
                AddValueComponent,
                DspAddValueTestComponent,
                TestIntValueComponent
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

        // console.log('add-value testHostFixture: ', testHostFixture);
        // console.log('add-value testHostComponent: ', testHostComponent);

        expect(testHostComponent).toBeTruthy();
    });

    it('should choose the apt component for an integer value', () => {

        console.log('testAddValueComponent: ', testHostComponent.testAddValueComponent);

        expect(testHostComponent.testAddValueComponent).toBeTruthy();

        // console.log('createValueComponent: ', testHostComponent.testAddValueComponent.createValueComponent);

        expect(testHostComponent.resourcePropertyDefinition.objectType).toEqual('http://api.knora.org/ontology/knora-api/v2#IntValue');

        expect(testHostComponent.testAddValueComponent.createValueComponent instanceof TestIntValueComponent).toBeTruthy();
    });

    describe('add new value', () => {

        let hostCompDe;
        let addValueComponentDe;

        beforeEach(() => {
            expect(testHostComponent.testAddValueComponent).toBeTruthy();

            hostCompDe = testHostFixture.debugElement;
            console.log(testHostFixture.debugElement);
            console.log(testHostComponent.testAddValueComponent);


            addValueComponentDe = hostCompDe.query(By.directive(AddValueComponent));
            console.log('addValueComponentDe: ', addValueComponentDe);

            expect(testHostComponent).toBeTruthy();
        });

        it('should add a new value to a property', () => {

            const valuesSpy = TestBed.inject(DspApiConnectionToken);

            (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).createValue.and.callFake(
                () => {

                    const response = new WriteValueResponse();

                    response.id = 'newID';
                    response.type = 'type';
                    response.uuid = 'uuid';

                    return of(response);
                }
            );

            (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).getValue.and.callFake(
                () => {

                    const createVal = new ReadIntValue();

                    createVal.id = 'newID';
                    createVal.int = 123;

                    const resource = new ReadResource();

                    resource.properties = {
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': [createVal]
                    };

                    return of(resource);
                }
            );

            testHostComponent.testAddValueComponent.canModify = true;
            testHostComponent.testAddValueComponent.createModeActive = true;

            testHostFixture.detectChanges();

            const saveButtonDebugElement = addValueComponentDe.query(By.css('button.save'));
            const saveButtonNativeElement = saveButtonDebugElement.nativeElement;

            expect(saveButtonNativeElement).toBeDefined();
        });
    });

});
