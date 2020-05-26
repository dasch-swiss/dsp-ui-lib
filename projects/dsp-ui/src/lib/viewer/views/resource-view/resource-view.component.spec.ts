import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockResource, ReadResource, PropertyDefinition, ResourcesEndpointV2 } from '@knora/api';
import { map } from 'rxjs/internal/operators/map';
import { DspApiConnectionToken } from '../../../core';
import { ResourceViewComponent, PropertyInfoValues } from './resource-view.component';

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
class TestParentComponent {

  @ViewChild('resView') resourceViewComponent: ResourceViewComponent;

  resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
}

describe('ResourceViewComponent', () => {
  let testHostComponent: TestParentComponent;
  let testHostFixture: ComponentFixture<TestParentComponent>;

  const spyObj = {
    v2: {
      res: jasmine.createSpyObj('res', ['getResource'])
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceViewComponent,
        TestParentComponent,
        TestPropertyViewComponent
      ],
      providers: [
        {
          provide: DspApiConnectionToken,
          useValue: spyObj
        }
      ]
    })
      .compileComponents();
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

    expect(testHostComponent).toBeTruthy();
  });


  it('should get a resource', () => {

    const resSpy = TestBed.inject(DspApiConnectionToken);

    expect(resSpy.v2.res.getResource).toHaveBeenCalledTimes(1);
    expect(resSpy.v2.res.getResource).toHaveBeenCalledWith(testHostComponent.resourceIri);
  });
});
