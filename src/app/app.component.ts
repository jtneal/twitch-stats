import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { authConfig } from './auth.config';
import { TwitchUser } from './twitch/twitch-user';
import { TwitchService } from './twitch/twitch.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public interval: Subscription;
  public points = 0;
  public user: TwitchUser;

  public constructor(private readonly auth: OAuthService, private readonly twitch: TwitchService) {
    this.auth.configure(authConfig);
    this.auth.tokenValidationHandler = new JwksValidationHandler();
    this.auth.loadDiscoveryDocumentAndTryLogin();
  }

  public ngOnInit(): void {
    this.setUser();
    this.updateSubPoints();

    this.interval = interval(30000).pipe(
      takeWhile(() => this.user !== undefined),
    ).subscribe(() => this.updateSubPoints());
  }

  public get name(): string {
    this.setUser();

    if (!this.user) {
      return;
    }

    return this.user.preferred_username;
  }

  public login(): void {
    this.auth.initLoginFlow();
  }

  public logout(): void {
    this.auth.logOut();
  }

  private setUser(): void {
    this.user = this.auth.getIdentityClaims() as TwitchUser;
  }

  private async updateSubPoints(): Promise<void> {
    if (this.user) {
      this.points = await this.twitch.getSubPoints(this.user.sub).toPromise();
    }
  }
}
