import { Component, OnInit } from '@angular/core';
import { ExtendedSearchParamsService } from '@dasch-swiss/dsp-ui';

@Component({
  selector: 'app-advanced-search-playground',
  templateUrl: './advanced-search-playground.component.html',
  styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

  constructor(private _extendedSearchParamsService: ExtendedSearchParamsService) { }

  ngOnInit(): void {

  }

  submitQuery(gravsearchQuery: string) {
      console.log('Output: ', gravsearchQuery);

      console.log('search params', this._extendedSearchParamsService.getSearchParams().generateGravsearch(1));
  }

}
