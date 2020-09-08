import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import {
    ApiResponseError,
    IHasPropertyWithPropertyDefinition,
    MockResource,
    ReadResource,
    ReadValue,
    ResourcePropertyDefinition,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { EmitEvent, Events, ValueOperationEventService } from '../../services/value-operation-event.service';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { PropertyViewComponent } from './property-view.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <dsp-property-view #propView
      [parentResource]="parentResource"
      [propArray]="propArray"
      [systemPropArray]="systemPropArray"
      [showAllProps]="showAllProps">
    </dsp-property-view>`
})
class TestPropertyParentComponent implements OnInit, OnDestroy {

    @ViewChild('propView') propertyViewComponent: PropertyViewComponent;

    parentResource: ReadResource;

    propArray: PropertyInfoValues[] = [];

    systemPropArray: SystemPropertyDefinition[] = [];

    showAllProps = false;

    voeSubscription: Subscription;

    myNum = 0;

    constructor(public _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {
        this.voeSubscription = this._valueOperationEventService.on(Events.ValueAdded, () => this.myNum += 1);

        MockResource.getTestthing().subscribe(response => {
            this.parentResource = response;

            // gather resource property information
            this.propArray = this.parentResource.entityInfo.classes[this.parentResource.type].getResourcePropertiesList().map(
                (prop: IHasPropertyWithPropertyDefinition) => {
                    const propInfoAndValues: PropertyInfoValues = {
                        propDef: prop.propertyDefinition,
                        guiDef: prop,
                        values: this.parentResource.getValues(prop.propertyIndex)
                    };
                    return propInfoAndValues;
                }
            );

            // sort properties by guiOrder
            this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

            // get system property information
            this.systemPropArray = this.parentResource.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);

        },
        (error: ApiResponseError) => {
            console.error('Error to get the mock resource', error);
        });
    }
    ngOnDestroy() {
        if (this.voeSubscription) {
            this.voeSubscription.unsubscribe();
        }
    }
}

/**
 * Test host component to simulate child component, here display-edit.
 */
@Component({
  selector: `dsp-display-edit`,
  template: ``
})
class TestDisplayValueComponent {

    @Input() parentResource: ReadResource;
    @Input() displayValue: ReadValue;
    @Input() configuration?: object;

}

/**
 * Test host component to simulate child component, here add-value.
 */
@Component({
    selector: `dsp-add-value`,
    template: ``
})
class TestAddValueComponent {

    @Input() parentResource: ReadResource;
    @Input() resourcePropertyDefinition: ResourcePropertyDefinition;

}

describe('PropertyViewComponent', () => {
    let testHostComponent: TestPropertyParentComponent;
    let testHostFixture: ComponentFixture<TestPropertyParentComponent>;
    let voeService: ValueOperationEventService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            MatIconModule,
            MatTooltipModule
        ],
        declarations: [
            TestPropertyParentComponent,
            TestDisplayValueComponent,
            TestAddValueComponent,
            PropertyViewComponent
        ],
        providers: [
            ValueOperationEventService
        ]
        })
        .compileComponents();

        voeService = TestBed.inject(ValueOperationEventService);
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestPropertyParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });


    it('should get 25 properties', () => {

        expect(testHostComponent.propArray).toBeTruthy();
        expect(testHostComponent.propArray.length).toBe(25);

    });

    it('should get the resource testding', () => {

        expect(testHostComponent.parentResource).toBeTruthy();
        expect(testHostComponent.parentResource.id).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        expect(testHostComponent.parentResource.label).toEqual('testding');

    });

    it('should display a text value among the property list', () => {

        expect(testHostComponent.propArray[4].propDef.label).toEqual('Text');
        expect(testHostComponent.propArray[4].propDef.comment).toBe(undefined);
        expect(testHostComponent.propArray[4].guiDef.cardinality).toEqual(2);
        expect(testHostComponent.propArray[4].guiDef.guiOrder).toEqual(2);
        expect(testHostComponent.propArray[4].values[0].type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');

    });

    it('should get some system properties', () => {

        expect(testHostComponent.systemPropArray).toBeTruthy();
        expect(testHostComponent.systemPropArray.length).toEqual(13);

        // check if the first system property is an ARK url
        expect(testHostComponent.systemPropArray[0].label).toEqual('ARK URL');

    });

    it('should trigger the callback when an event is emitted', () => {

        expect(testHostComponent.myNum).toEqual(0);

        voeService.emit(new EmitEvent(Events.ValueAdded));

        expect(testHostComponent.myNum).toEqual(1);
    });

    it('should unsubscribe from changes when destroyed', () => {
        expect(testHostComponent.voeSubscription.closed).toBe(false);

        testHostFixture.destroy();

        expect(testHostComponent.voeSubscription.closed).toBe(true);
    });

    describe('Add value', () => {
        let hostCompDe;
        let propertyViewComponentDe;

        beforeEach(() => {
            expect(testHostComponent.propertyViewComponent).toBeTruthy();

            hostCompDe = testHostFixture.debugElement;

            propertyViewComponentDe = hostCompDe.query(By.directive(PropertyViewComponent));

            expect(testHostComponent).toBeTruthy();

            testHostComponent.propertyViewComponent.addButtonIsVisible = true;
            testHostComponent.propertyViewComponent.addValueFormIsVisible = false;
            testHostFixture.detectChanges();
        });

        it('should show an add button under each property that has a value component and for which the cardinality is not 1', () => {
            const addButtons = propertyViewComponentDe.queryAll(By.css('button.create'));
            expect(addButtons.length).toEqual(13);

        });

        it('should show an add value component when the add button is clicked', () => {
            const addButtonDebugElement = propertyViewComponentDe.query(By.css('button.create'));
            const addButtonNativeElement = addButtonDebugElement.nativeElement;

            expect(propertyViewComponentDe.query(By.css('.add-value'))).toBeNull();

            addButtonNativeElement.click();

            testHostFixture.detectChanges();

            const addButtons = propertyViewComponentDe.queryAll(By.css('button.create'));

            // the add button for the property with the open add value form is hidden
            expect(addButtons.length).toEqual(12);

            expect(propertyViewComponentDe.query(By.css('.add-value'))).toBeDefined();

        });
    });

});
