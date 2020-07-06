import { TestBed } from '@angular/core/testing';

import { ExtendedSearchParams, ExtendedSearchParamsService } from './extended-search-params.service';

describe('SearchParamsService', () => {
    let service: ExtendedSearchParamsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExtendedSearchParamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false when initialized', () => {
        const searchParams: ExtendedSearchParams = service.getSearchParams();

        expect(searchParams.generateGravsearch(0)).toBeFalsy();
    });

    it('should set the parameters of an extended search', () => {
        const testMethod1 = (offset: number) => {
            return 'test1';
        };

        service.changeSearchParamsMsg(new ExtendedSearchParams(testMethod1));

        const searchParams: ExtendedSearchParams = service.getSearchParams();

        expect(searchParams.generateGravsearch(0)).toEqual('test1');

        // check if value is still present
        expect(searchParams.generateGravsearch(0)).toEqual('test1');

        const testMethod2 = (offset: number) => {
            return 'test2';
        };

        service.changeSearchParamsMsg(new ExtendedSearchParams(testMethod2));

        const searchParams2: ExtendedSearchParams = service.getSearchParams();

        expect(searchParams2.generateGravsearch(0)).toEqual('test2');

        // check if value is still present
        expect(searchParams2.generateGravsearch(0)).toEqual('test2');

    });

});
