import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MockProjects,
    MockResource,
    MockUsers,
    ProjectsEndpointAdmin,
    ReadResource,
    ResourcesEndpointV2
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, DspViewerModule, UserService } from '@dasch-swiss/dsp-ui';
import { ViewerPlaygroundComponent } from './viewer-playground.component';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('ViewerPlaygroundComponent', () => {
    let component: ViewerPlaygroundComponent;
    let fixture: ComponentFixture<ViewerPlaygroundComponent>;

    beforeEach(waitForAsync(() => {

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

                return of(user.body);
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
