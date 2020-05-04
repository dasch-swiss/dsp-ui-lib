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

        expect(convertedDate).toEqual('10/10/1993');
    });
});
