import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TextValueAsHtmlComponent} from './text-value-as-html.component';
import {ReadTextValueAsHtml} from '@knora/api';
import {OnInit, ViewChild, Component, DebugElement} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-text-value-as-html #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-text-value-as-html>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: TextValueAsHtmlComponent;

  displayInputVal: ReadTextValueAsHtml;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    const inputVal: ReadTextValueAsHtml = new ReadTextValueAsHtml();

    inputVal.hasPermissions = 'CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser';
    inputVal.userHasPermission = 'CR';
    inputVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
    inputVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TEST_ID';
    inputVal.html =
      '<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="kui-link">link</a></p>';
    inputVal.valueHasComment = 'very interesting';

    this.displayInputVal = inputVal;

    this.mode = 'read';
  }
}

describe('TextValueAsHtmlComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostDisplayValueComponent,
        TextValueAsHtmlComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  describe('display text value with markup', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueParagraph: DebugElement;
    let valueParagraphNativeElement;

    let commentSpan: DebugElement;
    let commentSpanNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

      valueParagraph = valueComponentDe.query(By.css('p.value'));
      valueParagraphNativeElement = valueParagraph.nativeElement;

      commentSpan = valueComponentDe.query(By.css('span.comment'));
      commentSpanNativeElement = commentSpan.nativeElement;

    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.html)
        .toEqual('<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="kui-link">link</a></p>');

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueParagraphNativeElement.innerHTML)
        .toEqual('<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="kui-link">link</a></p>');

      expect(commentSpanNativeElement.innerText).toEqual('very interesting');

    });
  });
});
