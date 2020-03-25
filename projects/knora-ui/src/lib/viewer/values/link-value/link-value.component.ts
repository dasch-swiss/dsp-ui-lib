import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateLinkValue, ReadLinkValue, ReadResource, UpdateLinkValue, KnoraApiConnection} from '@knora/api';
import {Subscription} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {KnoraApiConnectionToken} from '../../../core';

export function resourceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const invalid = !(control.value instanceof ReadResource);
    return invalid ? {'invalidType': {value: control.value}} : null;
  };
}

@Component({
  selector: 'kui-link-value',
  templateUrl: './link-value.component.html',
  styleUrls: ['./link-value.component.scss']
})

export class LinkValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {
  @Input() displayValue?: ReadLinkValue;
  @Input() parentResource: ReadResource;
  @Input() propIri: string;
  resources: ReadResource[] = [];
  restrictToResourceClass: string;
  valueFormControl: FormControl;
  commentFormControl: FormControl;
  form: FormGroup;

  valueChangesSubscription: Subscription;
  labelChangesSubscription: Subscription;
  // label cannot contain logical operations of lucene index
  customValidators = [resourceValidator()];

  constructor(@Inject(FormBuilder) private fb: FormBuilder, @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    super();
  }

  /**
   * Displays a selected resource using its label.
   *
   * @param resource the resource to be displayed (or no selection yet).
   */
  displayResource(resource: ReadResource | null): string {

    // null is the initial value (no selection yet)
    if (resource instanceof ReadResource) {
      return resource.label;
    }
  }

  /**
   * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
   * this is to be used for update and new linked resources
   *
   * @param searchTerm label to be searched
   */
  searchByLabel(searchTerm: string): ReadResource[] {
    // at least 3 characters are required
    if ( typeof searchTerm === 'string' && searchTerm.length >= 3) {

      this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, 0, {limitToResourceClass: this.restrictToResourceClass}).subscribe(
        (response: ReadResource[]) => {
          this.resources = response;
        });
    }
    return this.resources;
  }

  // show the label of the linked resource
  getInitValue(): ReadResource | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.linkedResource;
    } else {
      return null;
    }
  }

  standardValidatorFunc: (val: any, comment: string, commentCtrl: FormControl) => ValidatorFn = (initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {

      const invalid = (!(control.value instanceof ReadResource) || initValue.id === control.value.id)
        && (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));
      return invalid ? {valueNotChanged: {value: control.value}} : null;
    };
  };
  ngOnInit() {
    const linkType = this.parentResource.getLinkPropertyIriFromLinkValuePropertyIri(this.propIri);
    this.restrictToResourceClass = this.parentResource.entityInfo.properties[linkType].objectType;
    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    // subscribe to any change on the comment and recheck validity
    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );
    this.labelChangesSubscription = this.valueFormControl.valueChanges.subscribe(data => {
      this.resources = this.searchByLabel(data);
    });
    this.form = this.fb.group({
      linkValue: this.valueFormControl,
      comment: this.commentFormControl
    });
    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  // unsubscribe when the object is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
    if (this.labelChangesSubscription !== undefined) {
      this.labelChangesSubscription.unsubscribe();
    }
  }
  getNewValue(): CreateLinkValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }
    const newLinkValue = new CreateLinkValue();
    newLinkValue.linkedResourceIri = this.valueFormControl.value.id;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return newLinkValue;
  }

  getUpdatedValue(): UpdateLinkValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedLinkValue = new UpdateLinkValue();

    updatedLinkValue.id = this.displayValue.id;

    updatedLinkValue.linkedResourceIri = this.valueFormControl.value.id;
    // add the submitted comment to updatedLinkValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedLinkValue;
  }
}
