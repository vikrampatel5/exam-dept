import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';

@Injectable()
export class SignupService {

  constructor(private http: HttpClient) { }

  addClerk(clerk){
    const promise = new Promise((resolve, reject)=>{
      this.http.post('http://localhost:3000/users/addClerk', clerk)
      .toPromise()
      .then( res => {
        console.log('Worked');
        resolve();
      });
    })
  }

}
