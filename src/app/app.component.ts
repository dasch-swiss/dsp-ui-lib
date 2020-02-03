import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  CreateTextValueAsString,
  MockResource,
  ReadResource,
  ReadTextValueAsString,
  UpdateTextValueAsString
} from '@knora/api';
import {TextValueAsStringComponent} from 'knora-ui/lib/viewer/values/text-value/text-value-as-string/text-value-as-string.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('textEdit', {static: false}) textEditComponent: TextValueAsStringComponent;
  @ViewChild('textCreate', {static: false}) textCreateComponent: TextValueAsStringComponent;

  title = 'knora-ui-ng-lib';

  testthing: ReadResource;
  testText: ReadTextValueAsString;

  editModeActive = false;
  editMode = 'read';

  createMode = 'create';
  createdVal;

  ngOnInit(): void {
    MockResource.getTestthing().subscribe(
      thing => {
        this.testthing = thing[0];

        this.testText = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
      }
    );
  }

  ngAfterViewInit(): void {
    console.log(this.textEditComponent);
    console.log(this.textCreateComponent);

  }

  activateEditMode() {
    this.editModeActive = true;
    this.editMode = 'update';
  }

  saveEditValue() {
    this.editModeActive = false;
    const updatedVal = this.textEditComponent.getUpdatedValue();

    if (updatedVal instanceof UpdateTextValueAsString) {

      this.editMode = 'read';

      console.log('submitting updated value to Knora ', updatedVal);

      const newVal = new ReadTextValueAsString();
      newVal.id = 'newValId';
      newVal.text = updatedVal.text;

      this.testText = newVal;

    } else {
      console.log('invalid value');
    }
  }

  cancelEditValue() {
    this.editMode = 'read';
    this.editModeActive = false;
  }

  saveCreateValue() {

    const newVal = this.textCreateComponent.getNewValue();

    if (newVal instanceof CreateTextValueAsString) {

      const createdVal = new ReadTextValueAsString();
      createdVal.id = 'newValId';
      createdVal.text = newVal.text;

      this.createdVal = createdVal;
      this.createMode = 'read';
    } else {
      console.log('invalid value');
    }

    console.log();


  }

  cancelCreateValue() {
    this.textCreateComponent.resetFormControl();
  }

}
