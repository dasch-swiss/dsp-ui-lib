import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateGeonameValue, MockResource, ReadGeonameValue, UpdateGeonameValue } from '@dasch-swiss/dsp-js';
import { GeonameValueComponent } from './geoname-value.component';
import { GeonameService } from '../../services/geoname.service';
import { of } from 'rxjs';



/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <dsp-geoname-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></dsp-geoname-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal') inputValueComponent: GeonameValueComponent;

  displayInputVal: ReadGeonameValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestThing().subscribe(res => {
      const inputVal: ReadGeonameValue =
        res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname', ReadGeonameValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <dsp-geoname-value #inputVal [mode]="mode"></dsp-geoname-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal') inputValueComponent: GeonameValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('GeonameValueComponent', () => {
  beforeEach(waitForAsync(() => {

    const mockGeonameService = jasmine.createSpyObj('GeonameService', ['resolveGeonameID']);

    TestBed.configureTestingModule({
      declarations: [
        GeonameValueComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ],
       imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      providers: [{
          provide: GeonameService,
          useValue: mockGeonameService
        }]
    })
      .compileComponents();
  }));

  describe('display and edit a geoname value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;
    let valueReadModeDebugElement: DebugElement;
    let valueReadModeNativeElement;

    beforeEach(() => {
      const geonameServiceMock = TestBed.inject(GeonameService) as jasmine.SpyObj<GeonameService>;

      geonameServiceMock.resolveGeonameID.and.returnValue(of('Basel'));

      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(GeonameValueComponent));
      valueReadModeDebugElement = valueComponentDe.query(By.css('.rm-value'));
      valueReadModeNativeElement = valueReadModeDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      const geonameServiceMock = TestBed.inject(GeonameService) as jasmine.SpyObj<GeonameService>;

      expect(testHostComponent.inputValueComponent.displayValue.geoname).toEqual('2661604');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueReadModeNativeElement.innerText).toEqual('Basel');

      const anchorDebugElement = valueReadModeDebugElement.query(By.css('a'));
      expect(anchorDebugElement.nativeElement).toBeDefined();

      expect(anchorDebugElement.attributes.href).toEqual('https://www.geonames.org/2661604');
      expect(anchorDebugElement.attributes.target).toEqual('_blank');

      expect(geonameServiceMock.resolveGeonameID).toHaveBeenCalledOnceWith('2661604');

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('2661604');

      valueInputNativeElement.value = '5401678';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateGeonameValue).toBeTruthy();

      expect((updatedValue as UpdateGeonameValue).geoname).toEqual('5401678');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('2661604');

      valueInputNativeElement.value = '';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('2661604');

      valueInputNativeElement.value = '5401678';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(valueInputNativeElement.value).toEqual('2661604');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const geonameServiceMock = TestBed.inject(GeonameService) as jasmine.SpyObj<GeonameService>;

      geonameServiceMock.resolveGeonameID.and.returnValue(of('Terra Linda High School'));

      const newStr = new ReadGeonameValue();

      newStr.geoname = '5401678';
      newStr.id = 'updatedId';

      testHostComponent.displayInputVal = newStr;

      testHostFixture.detectChanges();

      expect(valueReadModeNativeElement.innerText).toEqual('Terra Linda High School');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(geonameServiceMock.resolveGeonameID).toHaveBeenCalledWith('5401678');

    });

    it('should unsubscribe when destroyed', () => {
      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeFalsy();

      testHostComponent.inputValueComponent.ngOnDestroy();

      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeTruthy();
    });
  });

  describe('create a geoname value', () => {

    let testHostComponent: TestHostCreateValueComponent;
    let testHostFixture: ComponentFixture<TestHostCreateValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostCreateValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(GeonameValueComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.displayValue).toEqual(undefined);
      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();
      expect(valueInputNativeElement.value).toEqual('');
      expect(commentInputNativeElement.value).toEqual('');
    });

    it('should create a value', () => {
      valueInputNativeElement.value = '5401678';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateGeonameValue).toBeTruthy();

      expect((newValue as CreateGeonameValue).geoname).toEqual('5401678');
    });

    it('should reset form after cancellation', () => {
      valueInputNativeElement.value = '5401678';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('');

      expect(commentInputNativeElement.value).toEqual('');

    });
  });
});
