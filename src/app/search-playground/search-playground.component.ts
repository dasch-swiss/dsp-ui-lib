import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SearchParams } from '@dasch-swiss/dsp-ui/lib/viewer';

@Component({
    selector: 'app-search-playground',
    templateUrl: './search-playground.component.html',
    styleUrls: ['./search-playground.component.scss']
})
export class SearchPlaygroundComponent implements OnInit {

    searchParams: SearchParams;

    display: 'fulltext' | 'advanced' | 'expert' | 'panel' = 'panel';

    form: FormGroup;

    projectIri = 'http://rdfh.ch/projects/0001';
    limitToProject: string;

    filterByProject = false;
    projectFilter = true;
    advancedSearch = true;
    expertSearch = true;

    loading = false;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) { }

    ngOnInit() {
        // set the default search view
        // this.option = this.selection[5];

        this.form = new FormGroup({
            filterbyproject: new FormControl(this.filterByProject),
            projectfilter: new FormControl(this.projectFilter),
            advancedsearch: new FormControl(this.advancedSearch),
            expertsearch: new FormControl(this.expertSearch)
        });

        this.form.valueChanges.subscribe(data => {
            // this.option = data.selectSearch;

            this.limitToProject = (data.filterbyproject ? this.projectIri : this.limitToProject = undefined);

            this.projectFilter = data.projectfilter;
            this.advancedSearch = data.advancedsearch;
            this.expertSearch = data.expertsearch;

            this.reload();
        });
    }

    doSearch(search: SearchParams) {
        // reset search params
        this.searchParams = undefined;
        // we can do the routing here or send the search param
        // to (resource) list view directly
        this.searchParams = search;
    }

    openResource(id: string) {
        console.log('open ', id);
    }

    // playground helper method
    switchComponent(comp: 'fulltext' | 'advanced' | 'expert' | 'panel') {
        this.display = comp;
    }

    /**
   * reload the search panel component tag
   * reset previous search and project filter
   */
    reload() {
        if (!this.limitToProject) {
            localStorage.removeItem('currentProject');
        }
        localStorage.removeItem('prevSearch')
        this.loading = true;
        setTimeout(x => this.loading = false);
    }

}
