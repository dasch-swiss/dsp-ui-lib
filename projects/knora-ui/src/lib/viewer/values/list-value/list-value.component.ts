import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateListValue, ReadListValue, UpdateListValue, ListNodeV2, KnoraApiConnection, ApiResponseError} from '@knora/api';
import { MatMenuTrigger } from '@angular/material/menu';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {KnoraApiConnectionToken} from '../../../core';


@Component({
  selector: 'kui-list-value',
  templateUrl: './list-value.component.html',
  styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadListValue;
  valueFormControl: FormControl;
  commentFormControl: FormControl;
  listRootNode: ListNodeV2;

  // active node
  selectedNode: ListNodeV2;

  form: FormGroup;

  valueChangesSubscription: Subscription;
  @ViewChild(MatMenuTrigger, { static: false }) menuTrigger: MatMenuTrigger;

  customValidators = [];

  constructor(@Inject(FormBuilder) private fb: FormBuilder,
              @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    super();
   }

   getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.listNodeLabel;
    } else {
      return null;
    }
   }
  // override the resetFormControl() from the base component to deal with initial link value label
  resetFormControl(): void {
    super.resetFormControl();

    if (this.valueFormControl !== undefined) {
      if (this.mode === 'read') {
        this.valueFormControl.setValue(this.getInitValue());
        this.commentFormControl.setValue(this.getInitComment());
        this.valueFormControl.clearValidators();
      } else {
        const rootNodeIri = this.displayValue.listNode;
        this.getRootNode(rootNodeIri);
        this.valueFormControl.clearValidators();
      }
    }
  }

  getRootNode(rootNodeIri): void {
    this.knoraApiConnection.v2.list.getNode(rootNodeIri).subscribe(
      (response: ListNodeV2) => {
        const nodeOfListValue = response;
        if (nodeOfListValue.isRootNode) {
          this.listRootNode = nodeOfListValue;
        } else {
          const hasRootNodeIRI = nodeOfListValue.hasRootNode;
          this.knoraApiConnection.v2.list.getList(hasRootNodeIRI).subscribe(
            (response2: ListNodeV2) => {
              this.listRootNode = response2;
            }, (error: ApiResponseError) => {
              console.error(error);
            });
          }
      },
      (error: ApiResponseError) => {
        console.error(error);
      }
    );
  }
  ngOnInit() {
    this.valueFormControl = new FormControl(null);
    this.commentFormControl = new FormControl(null);
    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );
    this.form = this.fb.group({
      listValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  getNewValue(): CreateListValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newListValue = new CreateListValue();


    newListValue.listNode = this.valueFormControl.value;


    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newListValue.valueHasComment = this.commentFormControl.value;
    }

    return newListValue;
  }

  getUpdatedValue(): UpdateListValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedListValue = new UpdateListValue();

    updatedListValue.id = this.displayValue.id;
    if (this.selectedNode) {
      updatedListValue.listNode = this.selectedNode.id;
    } else {
      updatedListValue.listNode = this.displayValue.listNode;
    }
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedListValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedListValue;
  }
  getSelectedNode(item: ListNodeV2) {
    this.menuTrigger.closeMenu();
    this.selectedNode = item;
    this.valueFormControl.setValue(item.id);
  }

}
