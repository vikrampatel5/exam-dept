import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { resolve } from 'url';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

export class UserItem {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}
}
@Injectable()
export class UserService {

  public users: UserItem[];

  constructor(private http: HttpClient, private ht: Http, private router:Router) {
    this.users = [];
   }

  addUser(clerk){
    return this.http.post('http://localhost:3000/users/addUser', clerk)
      .map( res => 
        {
        console.log(clerk + "added");
        // res.json();
      });

  }
  getUser(user){
  console.log(user);
  let params = new HttpParams().set("email",user.uname).set("password", user.pass); //Create new HttpParams
  // console.log(params);
  return this.http.get('http://localhost:3000/users/getUser',  {params: params})
      .map( res => {
        if(!res[0]){
          console.log('User Not Found');
        }
        else{
          this.router.navigate(["/dashboard"]);
        }
      });
  }

  getAllUsers(): Observable<UserItem[]>{
    return this.ht.get('http://localhost:3000/users/getAllUsers')
    .map(res => {
      return res.json().map(item => {
        // console.log(item);
         return new UserItem(
           item.id,
           item.name,
           item.email
         );
       });
    })
  }
}
