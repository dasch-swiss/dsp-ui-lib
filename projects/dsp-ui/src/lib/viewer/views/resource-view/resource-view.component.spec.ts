import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { MockResource, PropertyDefinition, ReadResource, ResourcesEndpointV2 } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DspApiConnectionToken } from '../../../core';
import { EmitEvent, Events, ValueOperationEventService } from '../../services/event-bus.service';
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

    ngOnInit() { }
}

/**
 * Test host component to simulate resource-view component.
 */
@Component({
template: `
    <dsp-resource-view #resView [iri]="resourceIri"></dsp-resource-view>`
})
class TestParentComponent implements OnInit {

    @ViewChild('resView') resourceViewComponent: ResourceViewComponent;

    resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

    voeSubscription: Subscription;

    myNum = 0;

    constructor(public _valueOperationEventService: ValueOperationEventService) { };

    ngOnInit() {
        this.voeSubscription = this._valueOperationEventService.on(Events.ValueAdded, () => this.myNum += 1);
    }
}

fdescribe('ResourceViewComponent', () => {
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
            TestPropertyViewComponent
        ],
        imports: [
            MatSnackBarModule,
            MatIconModule,
            FormsModule,
            ClipboardModule
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

    it('should trigger the callback when an event is emitted', () => {

        expect(testHostComponent.myNum).toEqual(0);

        voeService.emit(new EmitEvent(Events.ValueAdded));

        expect(testHostComponent.myNum).toEqual(1);
    });

    // TODO: currently not possible to test copy to clipboard from Material Angular
    // https://stackoverflow.com/questions/60337742/test-copy-to-clipboard-function

});
