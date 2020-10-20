import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import {
    DeleteValue,
    MockResource,
    PropertyDefinition,
    ReadIntValue,
    ReadResource,
    ReadTextValueAsString,
    ResourcesEndpointV2
} from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DspApiConnectionToken } from '../../../core';
import { EmitEvent, Events, ValueOperationEventService } from '../../services/value-operation-event.service';
import { PropertyInfoValues, ResourceViewComponent } from './resource-view.component';

/**
 * Test host component to simulate child component, here property-view.
 */
@Component({
selector: `dsp-property-view`,
template: ``
})
class TestPropertyViewComponent implements OnInit {

    @Input() parentResource: ReadResource;
    @Input() propArray: PropertyInfoValues;
    @Input() systemPropArray: PropertyDefinition;
    @Input() showAllProps: boolean;

    ngOnInit() { }
}

/**
 * Test host component to simulate resource-view component.
 */
@Component({
template: `
    <dsp-resource-view #resView [iri]="resourceIri"></dsp-resource-view>`
})
class TestParentComponent implements OnInit, OnDestroy {

    @ViewChild('resView') resourceViewComponent: ResourceViewComponent;

    resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

    voeSubscriptions: Subscription[] = [];

    myNum = 0;

    constructor(public _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {
        this.voeSubscriptions.push(this._valueOperationEventService.on(Events.ValueAdded, () => this.myNum = 1));
        this.voeSubscriptions.push(this._valueOperationEventService.on(Events.ValueUpdated, () => this.myNum = 2));
        this.voeSubscriptions.push(this._valueOperationEventService.on(Events.ValueDeleted, () => this.myNum = 3));
    }

    ngOnDestroy() {
        if (this.voeSubscriptions) {
            this.voeSubscriptions.forEach(sub => sub.unsubscribe());
        }
    }
}

@Component({selector: 'dsp-property-toolbar', template: ''})
class MockDspPropertyToolbarComponent {
    @Input() resource: ReadResource;
    @Input() showAllProps: boolean;
}

describe('ResourceViewComponent', () => {
    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;
    let hostCompDe;
    let resourceComponentDe;
    let voeService: ValueOperationEventService;

    beforeEach(async(() => {

        const spyObj = {
            v2: {
                res: jasmine.createSpyObj('res', ['getResource'])
            }
        };

        TestBed.configureTestingModule({
        declarations: [
            ResourceViewComponent,
            TestParentComponent,
            TestPropertyViewComponent,
            MockDspPropertyToolbarComponent
        ],
        imports: [
            MatIconModule,
            MatSnackBarModule
        ],
        providers: [
            {
                provide: DspApiConnectionToken,
                useValue: spyObj
            },
            ValueOperationEventService
        ]
        })
        .compileComponents();

        voeService = TestBed.inject(ValueOperationEventService);
    }));

    beforeEach(() => {
        const resSpy = TestBed.inject(DspApiConnectionToken);

        (resSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResource.and.callFake(
            (id: string) => {

                return MockResource.getTestthing().pipe(
                    map(
                        (res: ReadResource) => {
                            res.id = id;
                            return res;
                        }
                    ));
            }
        );

        testHostFixture = TestBed.createComponent(TestParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        hostCompDe = testHostFixture.debugElement;
        resourceComponentDe = hostCompDe.query(By.directive(ResourceViewComponent));

        expect(testHostComponent).toBeTruthy();
    });


    it('should get a resource', () => {

        const resSpy = TestBed.inject(DspApiConnectionToken);

        expect(resSpy.v2.res.getResource).toHaveBeenCalledTimes(1);
        expect(resSpy.v2.res.getResource).toHaveBeenCalledWith(testHostComponent.resourceIri);
    });

    it('should trigger the correct callback when an event is emitted', () => {

        expect(testHostComponent.myNum).toEqual(0);

        voeService.emit(new EmitEvent(Events.ValueAdded));

        expect(testHostComponent.myNum).toEqual(1);

        voeService.emit(new EmitEvent(Events.ValueUpdated));

        expect(testHostComponent.myNum).toEqual(2);

        voeService.emit(new EmitEvent(Events.ValueDeleted));

        expect(testHostComponent.myNum).toEqual(3);
    });

    it('should unsubscribe from changes when destroyed', () => {
        testHostComponent.voeSubscriptions.forEach(sub => {
            expect(sub.closed).toBe(false);
        });

        testHostFixture.destroy();

        testHostComponent.voeSubscriptions.forEach(sub => {
            expect(sub.closed).toBe(true);
        });
    });

    it('should add a value to a property of a resource', () => {
        const newReadIntValue = new ReadIntValue();

        newReadIntValue.int = 123;
        newReadIntValue.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        testHostComponent.resourceViewComponent.addValueToResource(newReadIntValue);

        const propArrayIntValues = testHostComponent.resourceViewComponent.resPropInfoVals.filter(
            propInfoValueArray => propInfoValueArray.propDef.id === newReadIntValue.property
        );

        expect(propArrayIntValues[0].values.length).toEqual(2);

        expect((propArrayIntValues[0].values[1] as ReadIntValue).int).toEqual(123);
    });

    it('should delete an int value from a property of a resource', () => {
        // add new value to be deleted (so that I can ensure the id will be what I expect)
        const newReadIntValue = new ReadIntValue();

        newReadIntValue.id = 'myNewReadIntId';
        newReadIntValue.int = 123;
        newReadIntValue.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        testHostComponent.resourceViewComponent.addValueToResource(newReadIntValue);

        // delete the value
        const valueToBeDeleted = new DeleteValue();

        valueToBeDeleted.id = 'myNewReadIntId';
        valueToBeDeleted.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';

        testHostComponent.resourceViewComponent.deleteValueFromResource(valueToBeDeleted);

        const propArrayIntValues = testHostComponent.resourceViewComponent.resPropInfoVals.filter(
            propInfoValueArray => propInfoValueArray.propDef.objectType === valueToBeDeleted.type
        );

        // expect there to be one value left after deleting the newly created value
        expect(propArrayIntValues[0].values.length).toEqual(1);

    });

    it('should delete a text value from a property of a resource', () => {
        // add new value to be deleted (so that I can ensure the id will be what I expect)
        const newReadTextValueAsString = new ReadTextValueAsString();

        newReadTextValueAsString.id = 'myNewReadTextValueAsStringId';
        newReadTextValueAsString.text = 'my text';
        newReadTextValueAsString.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';

        testHostComponent.resourceViewComponent.addValueToResource(newReadTextValueAsString);

        // delete the value
        const valueToBeDeleted = new DeleteValue();

        valueToBeDeleted.id = 'myNewReadTextValueAsStringId';
        valueToBeDeleted.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';

        testHostComponent.resourceViewComponent.deleteValueFromResource(valueToBeDeleted);

        const propArrayIntValues = testHostComponent.resourceViewComponent.resPropInfoVals.filter(
            propInfoValueArray => propInfoValueArray.propDef.objectType === valueToBeDeleted.type
        );

        // expect there to be one value left after deleting the newly created value
        expect(propArrayIntValues[0].values.length).toEqual(1);

    });

    it('should update a value of a property of a resource', () => {
        const newReadIntValue = new ReadIntValue();

        newReadIntValue.id = 'myNewReadIntId';
        newReadIntValue.int = 123;
        newReadIntValue.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        testHostComponent.resourceViewComponent.addValueToResource(newReadIntValue);

        let propArrayIntValues = testHostComponent.resourceViewComponent.resPropInfoVals.filter(
            propInfoValueArray => propInfoValueArray.propDef.id === newReadIntValue.property
        );

        expect(propArrayIntValues[0].values.length).toEqual(2);

        expect((propArrayIntValues[0].values[1] as ReadIntValue).int).toEqual(123);

        const updateReadIntValue = new ReadIntValue();

        updateReadIntValue.int = 321;
        updateReadIntValue.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        testHostComponent.resourceViewComponent.updateValueInResource(newReadIntValue, updateReadIntValue);

        propArrayIntValues = testHostComponent.resourceViewComponent.resPropInfoVals.filter(
            propInfoValueArray => propInfoValueArray.propDef.id === updateReadIntValue.property
        );

        expect(propArrayIntValues[0].values.length).toEqual(2);

        expect((propArrayIntValues[0].values[1] as ReadIntValue).int).toEqual(321);
    });

    // TODO: currently not possible to test copy to clipboard from Material Angular
    // https://stackoverflow.com/questions/60337742/test-copy-to-clipboard-function

});
