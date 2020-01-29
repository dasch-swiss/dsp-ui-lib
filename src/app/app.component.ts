import {Component, OnInit} from '@angular/core';
import {MockResource, ReadResource, ReadTextValueAsString} from '@knora/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

}
