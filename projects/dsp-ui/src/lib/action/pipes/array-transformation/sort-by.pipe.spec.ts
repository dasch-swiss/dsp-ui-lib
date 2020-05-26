import { SortByPipe } from './sort-by.pipe';
import { SortingService } from '../../services/sorting.service';

describe('SortByPipe', () => {

    let pipe: SortByPipe;
    let sortKey = '';
    const data = [
        {
            prename: 'Gaston',
            lastname: 'Lagaffe',
            creator: 'André Franquin'
        },
        {
            prename: 'Mickey',
            lastname: 'Mouse',
            creator: 'Walt Disney'
        },
        {
            prename: 'Gyro',
            lastname: 'Gearloose',
            creator: 'Carl Barks'
        },
        {
            prename: 'Charlie',
            lastname: 'Brown',
            creator: 'Charles M. Schulz'
        }
    ];

    beforeEach(() => {
        pipe = new SortByPipe(new SortingService());
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return an array sorted by creator', () => {
        sortKey = 'creator';
        expect(pipe.transform(data, sortKey)).toEqual(
            [
                Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })
            ]);
    });

    it('should return an array sorted by prename', () => {
        sortKey = 'prename';
        expect(pipe.transform(data, sortKey)).toEqual(
            [
                Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })
            ]);
    });

    it('should return an array sorted by lastname', () => {
        sortKey = 'lastname';
        expect(pipe.transform(data, sortKey)).toEqual(
            [
                Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })]);
    });
});
