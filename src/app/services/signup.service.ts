import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { resolve } from 'url';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class SignupService {

  constructor(private http: HttpClient) { }

  addClerk(clerk){
    return this.http.post('http://localhost:3000/users/addClerk', clerk)
      .map( res => {
        console.log(clerk + "added");
        // res.json();
      });
  }
  getUser(user){
  console.log(user);
  let params = new HttpParams().set("email",user.uname).set("password", user.pass); //Create new HttpParams
  console.log(params);
  return this.http.get('http://localhost:3000/users/getUser',  {params: params})
      .map( res => {
        // console.log(res.length);
        if(res.length>0){
          console.log('User Found');
        }
        else{
          console.log('User Not found!!')
        }
      });
  }

}
