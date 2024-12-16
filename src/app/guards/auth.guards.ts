import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      this.firebaseAuth.authState.subscribe((user) => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/auth']);
          observer.next(false);
        }
      });
    });
  }
}
