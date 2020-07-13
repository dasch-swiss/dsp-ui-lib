import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    CreateIntValue,
    CreateValue,
    MockResource,
    ReadIntValue,
    ReadResource,
    ResourcePropertyDefinition,
    UpdateResource,
    ValuesEndpointV2,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { DspApiConnectionToken } from '../../../core';
import { AddValueComponent } from './add-value.component';
import { ValueOperationEventService } from '../../services/value-operation-event.service';

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

        createIntVal.int = 123;

        return createIntVal;
    }

    updateCommentVisibility(): void { }
}

@Component({
    selector: `dsp-time-value`,
    template: ``
  })
  class TestTimeValueComponent {
    @Input() mode;

    @Input() displayValue;
  }

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `dsp-add-value-host-component`,
    template: `
      <dsp-add-value *ngIf="resourcePropertyDefinition" #testAddVal [resourcePropertyDefinition]="resourcePropertyDefinition" [parentResource]="readResource"></dsp-add-value>`
  })
class DspAddValueTestComponent implements OnInit {

    @ViewChild('testAddVal') testAddValueComponent: AddValueComponent;

    readResource: ReadResource;
    resourcePropertyDefinition: ResourcePropertyDefinition;

    ngOnInit() {

        MockResource.getTestthing().subscribe(res => {
            this.readResource = res;
        });

    }

    assignResourcePropDef(propIri: string) {
        const definitionForProp = this.readResource.entityInfo.getAllPropertyDefinitions()
        .filter( (resourcePropDef: ResourcePropertyDefinition) => {
            return resourcePropDef.id === propIri;
        }) as ResourcePropertyDefinition[];

        if (definitionForProp.length !== 1) {
            throw console.error('Property definition not found');
        }

        this.resourcePropertyDefinition = definitionForProp[0];
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
                TestIntValueComponent,
                TestTimeValueComponent
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: valuesSpyObj
                },
                ValueOperationEventService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(DspAddValueTestComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should choose the apt component for an integer value', () => {

        testHostComponent.assignResourcePropDef('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');

        testHostFixture.detectChanges();

        expect(testHostComponent.testAddValueComponent).toBeTruthy();

        expect(testHostComponent.resourcePropertyDefinition.objectType).toEqual('http://api.knora.org/ontology/knora-api/v2#IntValue');

        expect(testHostComponent.testAddValueComponent.createValueComponent instanceof TestIntValueComponent).toBeTruthy();
    });

    it('should choose the apt component for a time value', () => {

        testHostComponent.assignResourcePropDef('http://0.0.0.0:3333/ontology/0001/anything/v2#hasTimeStamp');

        testHostFixture.detectChanges();

        expect(testHostComponent.testAddValueComponent).toBeTruthy();

        expect(testHostComponent.resourcePropertyDefinition.objectType).toEqual('http://api.knora.org/ontology/knora-api/v2#TimeValue');

        expect(testHostComponent.testAddValueComponent.createValueComponent instanceof TestTimeValueComponent).toBeTruthy();
    });

    describe('add new value', () => {

        let hostCompDe;
        let addValueComponentDe;

        beforeEach(() => {
            testHostComponent.assignResourcePropDef('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');

            testHostFixture.detectChanges();

            expect(testHostComponent.testAddValueComponent).toBeTruthy();

            hostCompDe = testHostFixture.debugElement;

            addValueComponentDe = hostCompDe.query(By.directive(AddValueComponent));

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

                    const createdVal = new ReadIntValue();

                    createdVal.id = 'newID';
                    createdVal.int = 1;

                    const resource = new ReadResource();

                    resource.properties = {
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': [createdVal]
                    };

                    return of(resource);
                }
            );

            expect(testHostComponent.testAddValueComponent.createModeActive).toBeTruthy();

            const saveButtonDebugElement = addValueComponentDe.query(By.css('button.save'));
            const saveButtonNativeElement = saveButtonDebugElement.nativeElement;

            expect(saveButtonNativeElement).toBeDefined();

            saveButtonNativeElement.click();

            testHostFixture.detectChanges();

            const expectedUpdateResource = new UpdateResource();

            expectedUpdateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
            expectedUpdateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
            expectedUpdateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

            const expectedCreateVal = new CreateIntValue();
            expectedCreateVal.int = 123;

            expectedUpdateResource.value = expectedCreateVal;

            expect(valuesSpy.v2.values.createValue).toHaveBeenCalledWith(expectedUpdateResource);
            expect(valuesSpy.v2.values.createValue).toHaveBeenCalledTimes(1);

            expect(valuesSpy.v2.values.getValue).toHaveBeenCalledTimes(1);
            expect(valuesSpy.v2.values.getValue).toHaveBeenCalledWith(testHostComponent.readResource.id, 'uuid');

        });
    });

});
