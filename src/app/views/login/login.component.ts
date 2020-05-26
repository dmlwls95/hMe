import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiurl } from '../../../environments/apiservice';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  message = '';
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    /*const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        'Content-Type': 'application/json',

      })
    };*/
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${apiurl}/hme/login`, this.loginForm.value, {headers: httpHeaders})
    .pipe(map(res => {
      // console.log(res['token']);
      localStorage.setItem('jwtToken', res['token']);
      return res;
    }))
    .subscribe(res => {
      this.router.navigate(['base']);
    },
    (err) => {
      if (err.status === 401) {
        alert('아이디 혹은 비밀번호를 확인해주세요.');
      }
    }
    );

  }

  signUp() {
    this.router.navigate(['register']);
  }

  public handleError(error: any): Promise<never> {
    if (error.status === 401) {
      console.log('error');
    } else if (error.status === 400) {
        //
      }
        return Promise.reject(error);
  }
}
