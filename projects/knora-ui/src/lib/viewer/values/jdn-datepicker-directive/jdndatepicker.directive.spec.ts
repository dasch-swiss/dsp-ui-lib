import {JDNDatepickerDirective} from './jdndatepicker.directive';
import {Component, OnInit, ViewChild} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter} from "jdnconvertiblecalendardateadapter";
import {DateAdapter} from "@angular/material/core";

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-jdn-datepicker #activeCalDir [activeCalendar]=activeCalendar></kui-jdn-datepicker>`
})
class TestHostComponent implements OnInit {

  @ViewChild(JDNDatepickerDirective, {static: false}) jdnDir;

  activeCalendar: string;

  ngOnInit() {
    this.activeCalendar = 'Gregorian';
  }
}


describe('JDNDatepickerDirective', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  let testBehaviourSubject;
  let setNextCalSpy;
  let setCompleteSpy;

  let testBehaviourSubjSpy;

  beforeEach(async(() => {

    testBehaviourSubject = jasmine.createSpyObj('ACTIVE_CALENDAR', ['next', 'complete']);

    setNextCalSpy = testBehaviourSubject.next.and.stub();
    setCompleteSpy = testBehaviourSubject.complete.and.stub();

    TestBed.configureTestingModule({
      declarations: [
        JDNDatepickerDirective,
        TestHostComponent
      ],
      providers: [
        {
          provide: DateAdapter, useValue: {}},
        {
          provide: ACTIVE_CALENDAR, useValue: testBehaviourSubject
        }
      ],
      imports: [
        BrowserAnimationsModule
      ],
    })
      .compileComponents();

    // overrides the injection token defined in JDNDatepickerDirective's metadata
    TestBed.overrideProvider(ACTIVE_CALENDAR, {useValue: testBehaviourSubject});
    TestBed.overrideProvider(DateAdapter, {useValue: {}});

    testBehaviourSubjSpy = TestBed.get(ACTIVE_CALENDAR);
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.jdnDir).toBeTruthy();
  });

  it('should create an instance', () => {
    expect(testBehaviourSubjSpy.next).toHaveBeenCalledTimes(1);
    expect(testBehaviourSubjSpy.next).toHaveBeenCalledWith('Gregorian');
  });

  it('should update the calendar when the input changes', () => {
    testHostComponent.activeCalendar = 'Julian';
    testHostFixture.detectChanges();

    expect(testBehaviourSubjSpy.next).toHaveBeenCalledTimes(2);

    expect(testBehaviourSubjSpy.next.calls.all()[0].args).toEqual(['Gregorian']);
    expect(testBehaviourSubjSpy.next.calls.all()[1].args).toEqual(['Julian']);

  });

  it('should set the calendar to Gregorian when called with null', () => {
    testHostComponent.activeCalendar = null;
    testHostFixture.detectChanges();

    expect(testBehaviourSubjSpy.next).toHaveBeenCalledTimes(2);

    expect(testBehaviourSubjSpy.next.calls.all()[0].args).toEqual(['Gregorian']);
    expect(testBehaviourSubjSpy.next.calls.all()[1].args).toEqual(['Gregorian']);

  });

  it('should complete the BehaviourSubject when destroyed', () => {

    expect(setCompleteSpy).toHaveBeenCalledTimes(0);

    testHostComponent.jdnDir.ngOnDestroy();

    expect(setCompleteSpy).toHaveBeenCalledTimes(1);

  });

});
