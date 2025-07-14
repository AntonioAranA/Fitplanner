import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return boolean or Promise<boolean> when canActivate is called', async () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result: boolean | Promise<boolean> = (guard.canActivate as any)(route, state);

    if (typeof result === 'boolean') {
      expect(typeof result).toBe('boolean');
    } else if (result && typeof (result as any).then === 'function') {
      const resolved = await result;
      expect(typeof resolved).toBe('boolean');
    } else {
      fail('El método canActivate debe devolver booleano o Promise<boolean>');
    }
  });
});
