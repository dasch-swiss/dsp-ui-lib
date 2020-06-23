import { TestBed } from '@angular/core/testing';

import { ReadIntValue, ReadTextValue, ReadTextValueAsString, ReadTextValueAsHtml } from '@dasch-swiss/dsp-js';
import { ValueTypeService } from './value-type.service';

describe('ValueTypeService', () => {
    let service: ValueTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValueTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getValueTypeOrClass', () => {

        it('should return type of int', () => {
            const readIntValue = new ReadIntValue();
            readIntValue.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';
            expect(service.getValueTypeOrClass(readIntValue)).toEqual('http://api.knora.org/ontology/knora-api/v2#IntValue');
        });

        it('should return class of ReadTextValueAsString', () => {
            const readTextValueAsString = new ReadTextValueAsString();
            readTextValueAsString.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            expect(service.getValueTypeOrClass(readTextValueAsString)).toEqual('ReadTextValueAsString');
        });
    });

    describe('isReadOnly', () => {

        it('should not mark ReadTextValueAsString as ReadOnly', () => {
            const readTextValueAsString = new ReadTextValueAsString();
            readTextValueAsString.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsString);
            expect(service.isReadOnly(valueClass)).toBeFalsy();
        });

        it('should mark ReadTextValueAsHtml as ReadOnly', () => {
            const readTextValueAsHtml = new ReadTextValueAsHtml();
            readTextValueAsHtml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsHtml);
            expect(service.isReadOnly(valueClass)).toBeTruthy();
        });
    });
});
