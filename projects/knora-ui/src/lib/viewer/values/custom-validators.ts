import { Validators } from '@angular/forms';

export class CustomValidators{
    readonly intValidator = Validators.pattern(/^-?\d+$/)
}
