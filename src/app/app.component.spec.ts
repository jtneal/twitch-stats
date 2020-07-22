import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { TwitchService } from './twitch/twitch.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let auth: OAuthService;
  let twitch: TwitchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        OAuthModule.forRoot(),
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    auth = TestBed.inject(OAuthService);
    twitch = TestBed.inject(TwitchService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set sub points', fakeAsync(() => {
    spyOn(auth, 'getIdentityClaims').and.returnValue({ preferred_username: 'Hochi', sub: '123' });
    spyOn(twitch, 'getSubPoints').and.returnValue(of(9));
    component.ngOnInit();
    tick(30000);
    expect(component.points).toBe(9);
    component.interval.unsubscribe();
  }));

  it('should get name', () => {
    spyOn(auth, 'getIdentityClaims').and.returnValue({ preferred_username: 'Hochi', sub: '123' });
    expect(component.name).toBe('Hochi');
  });

  it('should not get name', () => {
    spyOn(auth, 'getIdentityClaims').and.returnValue(undefined);
    expect(component.name).toBeUndefined();
  });

  it('should login', () => {
    const spy = spyOn(auth, 'initLoginFlow').and.returnValue();
    component.login();
    expect(spy).toHaveBeenCalled();
  });

  it('should logout', () => {
    const spy = spyOn(auth, 'logOut').and.returnValue();
    component.logout();
    expect(spy).toHaveBeenCalled();
  });
});
