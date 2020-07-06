import { TestBed } from '@angular/core/testing';
import { AppInitService } from './app-init.service';

describe('TestService', () => {
  let service: AppInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the config file when method Init is called', async () => {

      const fetchSpy = spyOn(window, 'fetch').and.callFake(
          path => {
              return Promise.resolve(new Response(JSON.stringify({
                  apiProtocol: 'http',
                  apiHost: '0.0.0.0',
                  apiPort: 3333,
                  apiPath: '',
                  jsonWebToken: '',
                  logErrors: false
              })));
          }
      );

      await service.Init('config', { name: 'prod', production: true });

      expect(service.dspApiConfig.apiProtocol).toEqual('http');
      expect(service.dspApiConfig.apiHost).toEqual('0.0.0.0');
      expect(service.dspApiConfig.apiPort).toEqual(3333);
      expect(service.dspApiConfig.apiPath).toEqual('');
      expect(service.dspApiConfig.jsonWebToken).toEqual('');
      expect(service.dspApiConfig.logErrors).toEqual(false);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('config/config.prod.json');

  });

});
