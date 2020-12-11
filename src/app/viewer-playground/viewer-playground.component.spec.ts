import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MockProjects,
    MockResource,
    MockUsers,
    ProjectsEndpointAdmin,
    ReadResource,
    ResourcesEndpointV2,
    UserResponse,
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, DspViewerModule, UserService } from '@dasch-swiss/dsp-ui';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { ViewerPlaygroundComponent } from './viewer-playground.component';
import { AsyncSubject } from 'rxjs';

describe('ViewerPlaygroundComponent', () => {
    let component: ViewerPlaygroundComponent;
    let fixture: ComponentFixture<ViewerPlaygroundComponent>;

    beforeEach(async(() => {

        const apiSpyObj = {
            admin: {
                projectsEndpoint: jasmine.createSpyObj('projectsEndpoint', ['getProjectByIri'])
            },
            v2: {
                res: jasmine.createSpyObj('res', ['getResource'])
            }
        };

        const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

        TestBed.configureTestingModule({
            declarations: [
                ViewerPlaygroundComponent
            ],
            imports: [
                DspViewerModule,
                MatIconModule,
                MatTooltipModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: apiSpyObj
                },
                {
                    provide: UserService,
                    useValue: userServiceSpy
                },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const resSpy = TestBed.inject(DspApiConnectionToken);

        (resSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResource.and.callFake(
            (id: string) => {

                return MockResource.getTestThing().pipe(
                    map(
                        (res: ReadResource) => {
                            res.id = id;
                            return res;
                        }
                    ));
            }
        );

        const adminSpy = TestBed.inject(DspApiConnectionToken);

        // mock getProjectByIri response
        (adminSpy.admin.projectsEndpoint as jasmine.SpyObj<ProjectsEndpointAdmin>).getProjectByIri.and.callFake(
            () => {
                const project = MockProjects.mockProject();
                return of(project);
            }
        );

        const userSpy = TestBed.inject(UserService);

        // mock getUserByIri response
        (userSpy as jasmine.SpyObj<UserService>).getUser.and.callFake(
            () => {
                const user = MockUsers.mockUser();

                const subj: AsyncSubject<UserResponse> = new AsyncSubject();
                subj.next(user.body);
                subj.complete();

                return subj;
            }
        );

        fixture = TestBed.createComponent(ViewerPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
