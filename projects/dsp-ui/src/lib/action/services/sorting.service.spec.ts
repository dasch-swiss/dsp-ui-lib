import { TestBed } from '@angular/core/testing';

import { SortingService } from './sorting.service';

describe('SortingService', () => {
  let service: SortingService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('reverseArray', () => {

    let data: string[];

    beforeEach(() => {
        data = ['Bernouilli', 'Euler', 'Goldbach', 'Hermann'];
    });

    it('should reverse an array', () => {
        expect(service.reverseArray(data)).toEqual(['Hermann', 'Goldbach', 'Euler', 'Bernouilli']);
      });
  });

  describe('sortByAlphabetical', () => {

    let data:
    {
        firstname: string;
        lastname: string;
        creator: string;
    }[];

    let sortKey: string;

    beforeEach(() => {
        data = [
            {
                firstname: 'Gaston',
                lastname: 'Lagaffe',
                creator: 'André Franquin'
            },
            {
                firstname: 'Mickey',
                lastname: 'Mouse',
                creator: 'Walt Disney'
            },
            {
                firstname: 'Gyro',
                lastname: 'Gearloose',
                creator: 'Carl Barks'
            },
            {
                firstname: 'Charlie',
                lastname: 'Brown',
                creator: 'Charles M. Schulz'
            }
    ];
    });

    it('should return an array sorted by creator', () => {
        sortKey = 'creator';
        expect(service.sortByAlphabetical(data, sortKey)).toEqual(
            [
                Object({ firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })
            ]);
    });

    it('should return an array sorted by firstname', () => {
        sortKey = 'firstname';
        expect(service.sortByAlphabetical(data, sortKey)).toEqual(
            [
                Object({ firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })
            ]);
    });

    it('should return an array sorted by lastname', () => {
        sortKey = 'lastname';
        expect(service.sortByAlphabetical(data, sortKey)).toEqual(
            [
                Object({ firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }),
                Object({ firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }),
                Object({ firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }),
                Object({ firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })]);
    });
  });

});
