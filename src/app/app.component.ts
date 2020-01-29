import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadResource, ReadTextValueAsString} from '@knora/api';
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

  ngOnInit(): void {
    MockResource.getTestthing().subscribe(
      thing => {
        this.testthing = thing[0];

        this.testText = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];
      }
    );
  }

  ngAfterViewInit(): void {
    // console.log(this);
  }

}
