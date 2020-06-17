import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
        this.searchQuery = this._route.snapshot.paramMap.get('q');
        console.log('searchQuery', this.searchQuery);
        this.searchMode = this._route.snapshot.paramMap.get('mode');
        console.log('searchMode', this.searchMode);
        this.projectIri = decodeURIComponent(this._route.snapshot.paramMap.get('project'));
        console.log('projectIri', this.projectIri);
    }

}
