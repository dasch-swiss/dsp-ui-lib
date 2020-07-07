import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-search-playground',
  templateUrl: './advanced-search-playground.component.html',
  styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  submitQuery(gravsearchQuery: string) {
      console.log('Output: ', gravsearchQuery);
  }

}
