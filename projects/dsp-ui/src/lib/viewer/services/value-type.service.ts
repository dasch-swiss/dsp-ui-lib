import { Injectable } from '@angular/core';
import {
    Constants,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadValue
} from '@dasch-swiss/dsp-js';

@Injectable({
    providedIn: 'root'
})
export class ValueTypeService {

    private readonly _readTextValueAsString = 'ReadTextValueAsString';

    private readonly _readTextValueAsXml = 'ReadTextValueAsXml';

    private readonly _readTextValueAsHtml = 'ReadTextValueAsHtml';

    constants = Constants;

    constructor() { }

    /**
     * Given a value, determines the type or class representing it.
     *
     * For text values, this method determines the specific class in use.
     * For all other types, the given type is returned.
     *
     * @param value the given value.
     */
    getValueTypeOrClass(value: ReadValue): string {
        if (value.type === this.constants.TextValue) {
            if (value instanceof ReadTextValueAsString) {
                return this._readTextValueAsString;
            } else if (value instanceof ReadTextValueAsXml) {
                return this._readTextValueAsXml;
            } else if (value instanceof ReadTextValueAsHtml) {
                return this._readTextValueAsHtml;
            } else {
                throw new Error(`unknown TextValue class ${value}`);
            }
        } else {
            return value.type;
        }
    }

    /**
     * Equality checks with constants below are TEMPORARY until component is implemented.
     * Used so that the CRUD buttons do not show if a property doesn't have a value component.
     */

    /**
     * Determines if the given value is readonly.
     *
     * @param valueTypeOrClass the type or class of the given value.
     */
    isReadOnly(valueTypeOrClass: string): boolean {
        return valueTypeOrClass === this._readTextValueAsHtml ||
            valueTypeOrClass === this._readTextValueAsXml ||
            valueTypeOrClass === this.constants.GeomValue;
    }
}
