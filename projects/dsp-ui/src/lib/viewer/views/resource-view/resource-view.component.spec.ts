import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockResource, PropertyDefinition, ReadResource, ResourcesEndpointV2 } from '@dasch-swiss/dsp-js';
import { map } from 'rxjs/internal/operators/map';
import { DspApiConnectionToken } from '../../../core';
import { PropertyInfoValues, ResourceViewComponent } from './resource-view.component';
import { By } from '@angular/platform-browser';

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
  let hostCompDe;
  let resourceComponentDe;

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
      imports: [
          MatSnackBarModule
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

    hostCompDe = testHostFixture.debugElement;
    resourceComponentDe = hostCompDe.query(By.directive(ResourceViewComponent));

    expect(testHostComponent).toBeTruthy();
  });


  it('should get a resource', () => {

    const resSpy = TestBed.inject(DspApiConnectionToken);

    expect(resSpy.v2.res.getResource).toHaveBeenCalledTimes(1);
    expect(resSpy.v2.res.getResource).toHaveBeenCalledWith(testHostComponent.resourceIri);
  });

  // TODO: currently not possible to test copy to clipboard from Material Angular
  // https://stackoverflow.com/questions/60337742/test-copy-to-clipboard-function

});
