import { TestBed } from '@angular/core/testing';

import {
    KnoraDate, KnoraPeriod,
    MockResource, ReadDateValue,
    ReadIntValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml
} from '@dasch-swiss/dsp-js';
import { ValueService } from './value.service';

describe('ValueService', () => {
    let service: ValueService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValueService);
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

    describe('isTextEditable', () => {

        it('should determine if a given text with the standard mapping is editable', () => {

            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';
            expect(service.isTextEditable(readTextValueAsXml)).toBeTruthy();

        });

        it('should determine if a given text with a custom mapping is editable', () => {

            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/CustomMapping';
            expect(service.isTextEditable(readTextValueAsXml)).toBeFalsy();

        });

    });

    describe('isDateEditable', () => {

        it('should determine if a given date or period is editable', () => {

            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13))).toBe(true);

            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'AD', 2018, 5, 13))).toBe(true);

            // before common era
            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'BCE', 2018, 5, 13))).toBe(false);

            // before common era
            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'BC', 2018, 5, 13))).toBe(false);

            // month precision
            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'CE', 2018, 5))).toBe(false);

            // year precision
            expect(service.isDateEditable(new KnoraDate('GREGORIAN', 'CE', 2018))).toBe(false);

            expect(service.isDateEditable(new KnoraPeriod(
                new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13),
                new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13)
            ))).toBe(true);

            // period starts with year precision
            expect(service.isDateEditable(new KnoraPeriod(
                new KnoraDate('GREGORIAN', 'CE', 2018),
                new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13)
            ))).toBe(false);

            // period ends with year precision
            expect(service.isDateEditable(new KnoraPeriod(
                new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13),
                new KnoraDate('GREGORIAN', 'CE', 2019)
            ))).toBe(false);

            // period starts with BCE date
            expect(service.isDateEditable(new KnoraPeriod(
                new KnoraDate('GREGORIAN', 'BCE', 2018, 5, 13),
                new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13)
            ))).toBe(false);

            // period ends with BCE date
            expect(service.isDateEditable(new KnoraPeriod(
                new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13),
                new KnoraDate('GREGORIAN', 'BCE', 2019, 5, 13)
            ))).toBe(false);

        });

    });

    describe('isReadOnly', () => {

        it('should not mark ReadTextValueAsString as ReadOnly', () => {
            const readTextValueAsString = new ReadTextValueAsString();
            readTextValueAsString.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsString);
            expect(service.isReadOnly(valueClass, readTextValueAsString)).toBeFalsy();
        });

        it('should mark ReadTextValueAsHtml as ReadOnly', () => {
            const readTextValueAsHtml = new ReadTextValueAsHtml();
            readTextValueAsHtml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsHtml);
            expect(service.isReadOnly(valueClass, readTextValueAsHtml)).toBeTruthy();
        });

        it('should not mark ReadTextValueAsXml with standard mapping as ReadOnly', () => {
            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';
            const valueClass = service.getValueTypeOrClass(readTextValueAsXml);
            expect(service.isReadOnly(valueClass, readTextValueAsXml)).toBeFalsy();
        });

        it('should mark ReadTextValueAsXml with custom mapping as ReadOnly', () => {
            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/CustomMapping';
            const valueClass = service.getValueTypeOrClass(readTextValueAsXml);
            expect(service.isReadOnly(valueClass, readTextValueAsXml)).toBeTruthy();
        });

        it('should mark ReadDateValue with unsupported era as ReadOnly', done => {

            MockResource.getTestThing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'BCE', 2019, 5, 13);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeTruthy();

                done();

            });

        });

        it('should not mark ReadDateValue with supported era as ReadOnly', done => {

            MockResource.getTestThing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeFalsy();

                done();

            });

        });

        it('should mark ReadDateValue with unsupported precision as ReadOnly', done => {

            MockResource.getTestThing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeTruthy();

                done();

            });

        });

        it('should not mark ReadDateValue with supported precision as ReadOnly', done => {

            MockResource.getTestThing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 1);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeFalsy();

                done();

            });

        });

    });

    describe('compareObjectTypeWithValueType', () => {

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsString"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsString',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsHtml"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsHtml',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsXml"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsXml',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#IntValue" with "http://api.knora.org/ontology/knora-api/v2#IntValue"', () => {
            expect(service.compareObjectTypeWithValueType(
                'http://api.knora.org/ontology/knora-api/v2#IntValue',
                'http://api.knora.org/ontology/knora-api/v2#IntValue'))
                .toBeTruthy();
        });

        it('should fail to compare an IntValue with a DecimalValue', () => {
            expect(service.compareObjectTypeWithValueType(
                'http://api.knora.org/ontology/knora-api/v2#IntValue',
                'http://api.knora.org/ontology/knora-api/v2#DecimalValue'))
                .toBeFalsy();
        })

        it('should fail to compare "http://api.knora.org/ontology/knora-api/v2#IntValue" with "ReadTextValueAsString"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsString',
                'http://api.knora.org/ontology/knora-api/v2#IntValue'))
                .toBeFalsy();
        });

    });
});
