import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiurl } from '../environments/apiservice';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  msg: any;

  helper = new JwtHelperService();

  constructor(private router: Router, private http: HttpClient){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('jwtToken');
    if (token && (this.helper.isTokenExpired(token) === false)) {
        // logged in so return true
      return true;
    }
    this.router.navigate(['login'], { queryParams: { redirectTo: state.url}});
    return false;

  }
  isLoggedIn(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
      this.http.get(`${apiurl}/hme/jwtcheck`, httpOptions)
      .subscribe(res => {
        this.msg = res;
      }, err => {
    })
  }

}
