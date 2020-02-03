import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadResource, ReadTextValueAsString, UpdateTextValueAsString} from '@knora/api';
import {TextValueAsStringComponent} from 'knora-ui/lib/viewer/values/text-value/text-value-as-string/text-value-as-string.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('text', {static: false}) textComponent: TextValueAsStringComponent;

  title = 'knora-ui-ng-lib';

  testthing: ReadResource;
  testText: ReadTextValueAsString;

  editModeActive = false;
  mode = 'read';

  ngOnInit(): void {
    MockResource.getTestthing().subscribe(
      thing => {
        this.testthing = thing[0];

        this.testText = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
      }
    );
  }

  ngAfterViewInit(): void {
    console.log(this.textComponent.form);
  }

  activateEditMode() {
    this.editModeActive = true;
    this.mode = 'update';
  }

  save() {
    this.editModeActive = false;
    const updatedVal = this.textComponent.getUpdatedValue();

    if (updatedVal instanceof UpdateTextValueAsString) {

      this.mode = 'read';

      console.log('submitting updated value to Knora ', updatedVal);

      const newVal = new ReadTextValueAsString();
      newVal.id = 'newValId';
      newVal.text = updatedVal.text;

      this.testText = newVal;

    } else {
      console.log('invalid value');
    }
  }

  cancel() {
    this.mode = 'read';
    this.editModeActive = false;
  }

}
