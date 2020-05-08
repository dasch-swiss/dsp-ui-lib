import { KnoraDatePipe } from './knoradate.pipe';
import { KnoraDate } from '@knora/api';

describe('KnoradatePipe', () => {
    it('create an instance', () => {
        const pipe = new KnoraDatePipe();
        expect(pipe).toBeTruthy();
    });

    it('should return a date string', () => {
        const pipe = new KnoraDatePipe();
        const date = new KnoraDate('Gregorian', 'AD', 1993, 10, 10);

        const convertedDate = pipe.transform(date);

        expect(convertedDate).toEqual('10.10.1993');
    });

    it('should return the correct format depending on the format provided', () => {
        const pipe = new KnoraDatePipe();
        const date = new KnoraDate('Gregorian', 'AD', 1776, 7, 4);

        let convertedDate = pipe.transform(date, 'dd.MM.YYYY');

        expect(convertedDate).toEqual('04.07.1776');

        convertedDate = pipe.transform(date, 'dd-MM-YYYY');

        expect(convertedDate).toEqual('04-07-1776');

        convertedDate = pipe.transform(date, 'MM/dd/YYYY');

        expect(convertedDate).toEqual('07/04/1776');

        // should default to dd.MM.YYYY in the event of an invalid format
        convertedDate = pipe.transform(date, 'invalid format');

        expect(convertedDate).toEqual('04.07.1776');
    });

    it('should return a number of two digits', () => {
        const pipe = new KnoraDatePipe();

        let num = pipe.leftPadding(7);

        expect(num).toEqual('07');

        num = pipe.leftPadding(12);

        expect(num).toEqual('12');
    });
});
