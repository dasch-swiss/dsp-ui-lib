import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockResource, ReadResource, PropertyDefinition } from '@knora/api';
import { map } from 'rxjs/internal/operators/map';
import { KnoraApiConnectionToken } from '../../../core';
import { ResourceViewComponent, PropertyInfoValues } from './resource-view.component';

/**
 * Test host component to simulate child component, here property-view.
 */
@Component({
  selector: `kui-property-view`,
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
    <kui-resource-view #resView [iri]="resourceIri"></kui-resource-view>`
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
          provide: KnoraApiConnectionToken,
          useValue: spyObj
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const resSpy = TestBed.get(KnoraApiConnectionToken);

    resSpy.v2.res.getResource.and.callFake(
      (id: string) => {

        return MockResource.getTestthing().pipe(
          map(
            (res: ReadResource[]) => {
              res[0].id = id;
              return res[0];
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

    const resSpy = TestBed.get(KnoraApiConnectionToken);

    expect(resSpy.v2.res.getResource).toHaveBeenCalledTimes(1);
    expect(resSpy.v2.res.getResource).toHaveBeenCalledWith(testHostComponent.resourceIri);
  });
});
