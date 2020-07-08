import { Component, OnInit } from '@angular/core';
import { AdvancedSearchParamsService } from '@dasch-swiss/dsp-ui';

@Component({
  selector: 'app-advanced-search-playground',
  templateUrl: './advanced-search-playground.component.html',
  styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

  constructor(private _advancedSearchParamsService: AdvancedSearchParamsService) { }

  ngOnInit(): void {

  }

  submitQuery(gravsearchQuery: string) {
      console.log('Output: ', gravsearchQuery);

      console.log('search params', this._advancedSearchParamsService.getSearchParams().generateGravsearch(1));
  }

}
