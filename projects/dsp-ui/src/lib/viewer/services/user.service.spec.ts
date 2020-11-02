import { async, TestBed } from '@angular/core/testing';
import { MockUsers, UserResponse } from '@dasch-swiss/dsp-js';
import { AsyncSubject } from 'rxjs';
import { DspApiConnectionToken } from '../../core/core.module';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: {}
                }
            ]
        });

        service = TestBed.inject(UserService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['_userCache']).toBeDefined();
    });

    it('should get a user', done => {

        const userCacheSpy = spyOn(service['_userCache'], 'getUser').and.callFake(
            () => {
                const user = MockUsers.mockUser();

                const subj: AsyncSubject<UserResponse> = new AsyncSubject();
                subj.next(user.body);
                subj.complete();

                return subj;
            }
        );

        service.getUser('http://rdfh.ch/users/root').subscribe(
            user => {
                expect(user.user.id).toEqual('http://rdfh.ch/users/root');
                expect(userCacheSpy).toHaveBeenCalledTimes(1);
                expect(userCacheSpy).toHaveBeenCalledWith('http://rdfh.ch/users/root');
                done();
            }
        );

    });

});
