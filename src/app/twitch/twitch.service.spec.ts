import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BroadcasterSubscriberResponse } from './twitch';
import { TwitchService } from './twitch.service';

describe('TwitchService', () => {
  const mockResponse: BroadcasterSubscriberResponse = {
    data: [
      { tier: '1000' },
      { tier: '2000' },
      { tier: '3000' },
    ],
  };
  let httpTestingController: HttpTestingController;
  let service: TwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get broadcaster subscribers', () => {
    service.getBroadcasterSubscribers('123').subscribe((subs) => {
      expect(subs.data[0].tier).toBe('1000');
      expect(subs.data[1].tier).toBe('2000');
      expect(subs.data[2].tier).toBe('3000');
    });

    const req = httpTestingController.expectOne('https://api.twitch.tv/helix/subscriptions?broadcaster_id=123');

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should get sub points', () => {
    service.getSubPoints('123').subscribe((subs) => {
      expect(subs).toBe(9);
    });

    const req = httpTestingController.expectOne('https://api.twitch.tv/helix/subscriptions?broadcaster_id=123');

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
    httpTestingController.verify();
  });
});
