import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateLinkValue, ReadLinkValue, UpdateLinkValue} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'kui-link-value',
  templateUrl: './link-value.component.html',
  styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadLinkValue;
  options: [string];
  valueFormControl: FormControl;
  commentFormControl: FormControl;
  form: FormGroup;

  valueChangesSubscription: Subscription;
  // label cannot contain logical operations of lucene index
  customValidators = [Validators.pattern(/^-?\d+$/)];
  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  /**
   * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
   * this is to be used for update and new linked resources
   *
   * @param label to be searched
   */
  // searchByLabel(searchTerm: string) {
  //
  //   // at least 3 characters are required
  //   if (searchTerm.length >= 3) {
  //     this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, 0, { limitToResourceClass: this._restrictToResourceClass }).subscribe(
  //       (response: ReadResource[]) => {
  //         this.resources = response;
  //       });
  //   } else {
  //     // clear selection
  //     this.resources = undefined;
  //
  //   }
  //
  // }

  // show the label of the linked resource
  getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.linkedResource.label;
    } else {
      return null;
    }
  }

  ngOnInit() {
    console.log('here')
    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    // subscribe to any change on the comment and recheck validity
    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      linkValue: this.valueFormControl,
      comment: this.commentFormControl
    });
    this.options = [this.getInitValue()];
    console.log(this.options);
    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  // unsubscribe when the object is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }
  getNewValue(): CreateLinkValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }
    const newLinkValue = new CreateLinkValue();
    // check that resource with given label exists
    newLinkValue.linkedResourceIri = this.valueFormControl.value;

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

    updatedLinkValue.linkedResourceIri = this.commentFormControl.value;

    // add the submitted comment to updatedLinkValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedLinkValue;
  }

}
