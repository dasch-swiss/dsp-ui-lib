import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

    @Input() searchQuery?: string;

    @Input() searchMode?: string;

    @Input() projectIri?: string;

    constructor(private _route: ActivatedRoute) { }

    ngOnInit() {
        this._route.paramMap.subscribe(
            (params: Params) => {
                this.searchQuery = params.get('q');
                this.searchMode = params.get('mode');
                if (params.get('project') && (this.projectIri !== decodeURIComponent(params.get('project')))) {
                    this.projectIri = decodeURIComponent(params.get('project'));
                } else {
                    this.projectIri = 'All projects';
                }
            });
    }

}
