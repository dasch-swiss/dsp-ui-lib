import { Injectable } from '@angular/core';
import {
    Constants,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadValue,
    ResourcePropertyDefinition
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
     * Given a ResourcePropertyDefinition of a #hasText property, determines the class representing it.
     *
     * @param resourcePropDef the given ResourcePropertyDefinition.
     */
    getTextValueClass(resourcePropDef: ResourcePropertyDefinition): string {
        if (resourcePropDef.guiElement === 'http://api.knora.org/ontology/salsah-gui/v2#SimpleText') {
            return this._readTextValueAsString;
        } else if (resourcePropDef.guiElement === 'http://api.knora.org/ontology/salsah-gui/v2#Richtext') {
            return this._readTextValueAsHtml;
        } else {
            throw new Error(`unknown TextValue class ${resourcePropDef}`);
        }
    }

    /**
     * Given the ObjectType of a PropertyDefinition, compares it to the type of the type of the provided value.
     * Primarily used to check if a TextValue type is equal to one of the readonly strings in this class.
     *
     * @param objectType PropertyDefinition ObjectType
     * @param valueType Value type (ReadValue, DeleteValue, BaseValue, etc.)
     */
    compareObjectTypeWithValueType(objectType: string, valueType: string): boolean {
        return objectType === this._readTextValueAsString ||
                objectType === this._readTextValueAsHtml ||
                objectType === this._readTextValueAsXml ||
                objectType === valueType;
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
