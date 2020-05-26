import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiurl } from '../../../environments/apiservice';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }
  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      ID: ['', Validators.required],
      PW: ['', Validators.required]
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
    return this.http.post<any>(`${apiurl}/hme/signup`, this.registerForm.value, {headers: httpHeaders})
    .subscribe(res => {
      alert('회원가입 완료');
      this.router.navigate(['login']);
    },
    (err) => {
        if (err.status === 400) {
          alert('아이디가 존재합니다.');
        }
      }
    );

  }

}
