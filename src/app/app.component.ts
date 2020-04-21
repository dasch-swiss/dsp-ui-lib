import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  resourceIri: string;

  constructor() {
  }

  ngOnInit(): void {
    this.resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
  }
}