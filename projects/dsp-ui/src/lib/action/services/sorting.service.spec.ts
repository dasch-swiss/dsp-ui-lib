import { TestBed } from '@angular/core/testing';

import { SortingService } from './sorting.service';

describe('SortingService', () => {
  let service: SortingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            SortingService
        ]
    });

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
        const sorted = service.keySortByAlphabetical(data, 'creator');
        expect(sorted).toEqual(
            [
                { firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' },
                { firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' },
                { firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' },
                { firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' }
            ]);
    });

    it('should return an array sorted by firstname', () => {
        const sorted = service.keySortByAlphabetical(data, 'firstname');
        expect(sorted).toEqual(
            [
                { firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' },
                { firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' },
                { firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' },
                { firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' }
            ]);
    });

    it('should return an array sorted by lastname', () => {
        const sorted = service.keySortByAlphabetical(data, 'lastname');
        expect(sorted).toEqual(
            [
                { firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' },
                { firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' },
                { firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' },
                { firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' }
            ]);
    });

    it('should return an array sorted by lastname reversed', () => {
        const sorted = service.keySortByAlphabetical(data, 'lastname', true);
        expect(sorted).toEqual(
            [
                { firstname: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' },
                { firstname: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' },
                { firstname: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' },
                { firstname: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }
            ]);
    });
  });

});
