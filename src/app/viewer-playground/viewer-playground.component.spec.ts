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
    UsersEndpointAdmin
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, DspViewerModule } from '@dasch-swiss/dsp-ui';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { ViewerPlaygroundComponent } from './viewer-playground.component';

describe('ViewerPlaygroundComponent', () => {
    let component: ViewerPlaygroundComponent;
    let fixture: ComponentFixture<ViewerPlaygroundComponent>;

    beforeEach(async(() => {

        const apiSpyObj = {
            admin: {
                usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUserByIri']),
                projectsEndpoint: jasmine.createSpyObj('projectsEndpoint', ['getProjectByIri'])
            },
            v2: {
                res: jasmine.createSpyObj('res', ['getResource'])
            }
        };

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
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const resSpy = TestBed.inject(DspApiConnectionToken);

        (resSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResource.and.callFake(
            (id: string) => {

                return MockResource.getTestthing().pipe(
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
        // mock getUserByIri response
        (adminSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUserByIri.and.callFake(
            () => {
                const user = MockUsers.mockUser();
                return of(user);
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
