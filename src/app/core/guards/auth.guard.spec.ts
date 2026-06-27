import { Router } from '@angular/router';
import moment from 'moment';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

describe('AuthGuard', () => {

    let router: jasmine.SpyObj<Router>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let notificationService: jasmine.SpyObj<NotificationService>;

    beforeEach(() => {
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        authService = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['getCurrentUser']);
        notificationService = jasmine.createSpyObj<NotificationService>('NotificationService', ['openSnackBar']);
    });

    it('create an instance', () => {
        const guard = new AuthGuard(router, notificationService, authService);
        expect(guard).toBeTruthy();
    });

    it('returns false if user is null', () => {
        authService.getCurrentUser.and.returnValue(null);
        const guard = new AuthGuard(router, notificationService, authService);

        const result = guard.canActivate();

        expect(result).toBe(false);
    });

    it('redirects to login if user is null', () => {
        authService.getCurrentUser.and.returnValue(null);
        const guard = new AuthGuard(router, notificationService, authService);

        guard.canActivate();

        expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
    });

    it('does not display expired notification if user is null', () => {
        authService.getCurrentUser.and.returnValue(null);
        const guard = new AuthGuard(router, notificationService, authService);

        guard.canActivate();

        expect(notificationService.openSnackBar).toHaveBeenCalledTimes(0);
    });

    it('redirects to login if user session has expired', () => {
        const user = { expiration: moment().add(-1, 'minutes') };
        authService.getCurrentUser.and.returnValue(user);
        const guard = new AuthGuard(router, notificationService, authService);

        guard.canActivate();

        expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
    });

    it('displays notification if user session has expired', () => {
        const user = { expiration: moment().add(-1, 'seconds') };
        authService.getCurrentUser.and.returnValue(user);
        const guard = new AuthGuard(router, notificationService, authService);

        guard.canActivate();

        expect(notificationService.openSnackBar)
            .toHaveBeenCalledWith('Your session has expired');
    });

    it('returns true if user session is valid', () => {
        const user = { expiration: moment().add(1, 'minutes') };
        authService.getCurrentUser.and.returnValue(user);
        const guard = new AuthGuard(router, notificationService, authService);

        const result = guard.canActivate();

        expect(result).toBe(true);
    });

});
