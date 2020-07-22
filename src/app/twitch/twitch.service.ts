import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { authConfig } from '../auth.config';
import { BroadcasterSubscriber, BroadcasterSubscriberResponse } from './twitch';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  constructor(private readonly http: HttpClient) {}

  public getBroadcasterSubscribers(broadcasterId: string): Observable<BroadcasterSubscriberResponse> {
    const url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}`;
    const options = { headers: new HttpHeaders({ 'Client-ID': authConfig.clientId }) };

    return this.http.get<BroadcasterSubscriberResponse>(url, options);
  }

  public getSubPoints(broadcasterId: string): Observable<number> {
    return this.getBroadcasterSubscribers(broadcasterId).pipe(
      map((response) => {
        let points = 0;

        response.data.forEach((sub) => points += this.getSubValue(sub));

        return points;
      }),
    );
  }

  private getSubValue(sub: BroadcasterSubscriber) {
    switch (sub.tier) {
      case '3000':
        return 6;
      case '2000':
        return 2;
      default:
        return 1;
    }
  }
}
