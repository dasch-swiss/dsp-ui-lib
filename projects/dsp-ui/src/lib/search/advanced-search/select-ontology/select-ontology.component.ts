import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OntologiesMetadata } from '@knora/api';

@Component({
  selector: 'dsp-select-ontology',
  templateUrl: './select-ontology.component.html',
  styleUrls: ['./select-ontology.component.scss']
})
export class SelectOntologyComponent implements OnInit {

    @Input() formGroup: FormGroup;

    @Input() ontologiesMetadata: OntologiesMetadata;

    @Output() ontologySelected = new EventEmitter<string>();

    form: FormGroup;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {

        // build a form for the named graph selection
        this.form = this.fb.group({
            ontologies: [null, Validators.required]
        });

        // emit Iri of the ontology when selected
        this.form.valueChanges.subscribe((data) => {
            this.ontologySelected.emit(data.ontologies);
        });

        // add form to the parent form group
        this.formGroup.addControl('ontologies', this.form);

    }

}
