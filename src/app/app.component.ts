import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  ApiResponseData,
  CreateTextValueAsString,
  KnoraApiConfig,
  KnoraApiConnection,
  LoginResponse,
  ReadResource,
  ReadTextValueAsString,
  UpdateResource,
  UpdateTextValueAsString,
  UpdateValue,
  WriteValueResponse
} from '@knora/api';
import {TextValueAsStringComponent} from 'knora-ui/lib/viewer/values/text-value/text-value-as-string/text-value-as-string.component';
import {mergeMap} from 'rxjs/operators';

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

  knoraApiConnection;

  ngOnInit(): void {
    /*MockResource.getTestthing().subscribe(
      thing => {
        this.testthing = thing[0];

        this.testText = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
      }
    );*/

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);

    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').pipe(
      mergeMap(
        (loginResponse: ApiResponseData<LoginResponse>) => {
          return this.knoraApiConnection.v2.res.getResource('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        }
      )
    ).subscribe(
      (resource: ReadResource) => {
        this.testthing = resource;
        this.testText = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
      }
    );

  }

  ngAfterViewInit(): void {
    // console.log(this);
    // console.log(this.textEditComponent);
    // console.log(this.textCreateComponent);

  }

  activateEditMode() {
    this.editModeActive = true;
    this.editMode = 'update';
  }

  saveEditValue() {
    this.editModeActive = false;
    const updatedVal = this.textEditComponent.getUpdatedValue();

    if (updatedVal instanceof UpdateTextValueAsString) {

      const updateRes = new UpdateResource();
      updateRes.id = this.testthing.id;
      updateRes.type = this.testthing.type;
      updateRes.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';
      updateRes.value = updatedVal;

      this.knoraApiConnection.v2.values.updateValue(updateRes as UpdateResource<UpdateValue>).pipe(
        mergeMap((res: WriteValueResponse) => {
          console.log(res);
          return this.knoraApiConnection.v2.values.getValue(this.testthing.id, this.testText.uuid);
        })
      ).subscribe(
        (res2: ReadResource) => {
          console.log(res2);
          this.testText = res2.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
          this.editMode = 'read';
        }
      );

    } else {
      console.error('invalid value');
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
      console.error('invalid value');
    }

  }

  cancelCreateValue() {
    this.textCreateComponent.resetFormControl();
  }

}
