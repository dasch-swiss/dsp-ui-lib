import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KnoraApiConfig } from '@dasch-swiss/dsp-js';
import { DspApiConfigToken } from '../../core/core.module';
import { ExpertSearchComponent } from './expert-search.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-expert-search #expSearch></dsp-expert-search>`
})
class TestHostComponent implements OnInit {

    @ViewChild('expSearch') expertSearch: ExpertSearchComponent;

    ngOnInit() {
    }

}

describe('ExpertSearchComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let hostCompDe: DebugElement;

  const dspConfSpy = new KnoraApiConfig('http', 'localhost', 3333, undefined, undefined, true);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            ExpertSearchComponent,
            TestHostComponent
        ],
        imports: [
            FormsModule,
            ReactiveFormsModule,
            RouterTestingModule,
            BrowserAnimationsModule,
            MatFormFieldModule,
            MatInputModule
        ],
        providers: [
            {
                provide: DspApiConfigToken,
                useValue: dspConfSpy
            },
            {
                provide: ActivatedRoute,
                useValue: {
                params: null
                }
            }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;

    testHostFixture.detectChanges();

    hostCompDe = testHostFixture.debugElement;
  });

  it('should create', () => {
    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.expertSearch).toBeTruthy();
  });

  it('should init the form with the default query', () => {
    const textarea = hostCompDe.query(By.css('textarea.textarea-field-content'));
    const textareaEle = textarea.nativeElement;

    expect(textareaEle.value).toBe(
        `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`
    );
  });

  it('should reset the form', () => {

    const resetBtn = hostCompDe.query(By.css('button.reset'));
    const textarea = hostCompDe.query(By.css('textarea.textarea-field-content'));

    const resetEle = resetBtn.nativeElement;
    const textareaEle = textarea.nativeElement;

    // delete textarea content displayed by default to make a change
    textareaEle.value = '';
    expect(textareaEle.value).toBe('');

    resetEle.click();

    testHostFixture.detectChanges();

    // reset the textarea content
    expect(textareaEle.value).toBe(
        `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`
    );
  });

});
