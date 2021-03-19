import { Injectable } from '@angular/core';
import {
    Constants, KnoraDate, KnoraPeriod, Precision, ReadDateValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadValue,
    ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';

@Injectable({
    providedIn: 'root'
})
export class ValueService {

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
        switch (resourcePropDef.guiElement) {
            case 'http://api.knora.org/ontology/salsah-gui/v2#SimpleText':
                return this._readTextValueAsString;
            case 'http://api.knora.org/ontology/salsah-gui/v2#Richtext':
                return this._readTextValueAsXml;
            default:
                return this._readTextValueAsString;
        }

    }

    /**
     * Given the ObjectType of a PropertyDefinition, compares it to the provided value type.
     * Primarily used to check if a TextValue type is equal to one of the readonly strings in this class.
     *
     * @param objectType PropertyDefinition ObjectType
     * @param valueType Value type (ReadValue, DeleteValue, BaseValue, etc.)
     */
    compareObjectTypeWithValueType(objectType: string, valueType: string): boolean {
        return (objectType === this._readTextValueAsString && valueType === this.constants.TextValue) ||
                (objectType === this._readTextValueAsHtml && valueType === this.constants.TextValue) ||
                (objectType === this._readTextValueAsXml && valueType === this.constants.TextValue) ||
                objectType === valueType;
    }

    /**
     * Given a date, checks if its precision is supported by the datepicker.
     *
     * @param date date to be checked.
     */
    private checkPrecision(date: KnoraDate): boolean {
        return date.precision === Precision.dayPrecision;
    }

    /**
     * Given a date, checks if its era is supported by the datepicker.
     *
     * @param date date to be checked.
     */
    private checkEra(date: KnoraDate): boolean {
        return date.era === 'CE' || date.era === 'AD';
    }

    /**
     * Determines if a date or period can be edited using this component.
     *
     * @param date the date or period to be edited.
     */
    isDateEditable(date: KnoraDate | KnoraPeriod): boolean {

        // only day precision is supported by the MatDatepicker
        let precisionSupported: boolean;
        // only common era is supported by the MatDatepicker
        let eraSupported: boolean;

        if (date instanceof KnoraDate) {
            precisionSupported = this.checkPrecision(date);
            eraSupported = this.checkEra(date);
        } else {
            precisionSupported = this.checkPrecision(date.start) && this.checkPrecision(date.end);
            eraSupported = this.checkEra(date.start) && this.checkEra(date.end);
        }

        return precisionSupported && eraSupported;
    }

    /**
     * Determines if a text can be edited using the text editor.
     *
     * @param textValue the text value to be checked.
     */
    isTextEditable(textValue: ReadTextValueAsXml): boolean {
        return textValue.mapping === Constants.StandardMapping;
    }

    /**
     * Determines if the given value can be edited.
     *
     * @param valueTypeOrClass the type or class of the given value.
     * @param value the given value.
     * @param propertyDef the given values property definition.
     */
    isReadOnly(valueTypeOrClass: string, value: ReadValue, propertyDef: ResourcePropertyDefinition): boolean {

        // if value is not editable in general from the ontology,
        // flag it as read-only
        if (!propertyDef.isEditable) {
            return true;
        }

        // only texts complying with the standard mapping can be edited using CKEditor.
        const xmlValueNonStandardMapping
            = valueTypeOrClass === this._readTextValueAsXml
            && (value instanceof ReadTextValueAsXml && !this.isTextEditable(value));

        // MatDatepicker only supports day precision and CE
        const dateNotEditable
            = valueTypeOrClass === this.constants.DateValue && (value instanceof ReadDateValue && !this.isDateEditable(value.date));

        return valueTypeOrClass === this._readTextValueAsHtml ||
            valueTypeOrClass === this.constants.GeomValue ||
            xmlValueNonStandardMapping ||
            dateNotEditable;
    }
}
