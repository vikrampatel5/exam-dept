import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

class PaperStatus {
  constructor(
    public subject_code: string,
    public examiner_id: string,
    public proposal: string,
    public recieved: string,
  ) {}
}

@Injectable()
export class PaperRecievedService {

  paperStatus : PaperStatus[];

  constructor(private http: Http) { 
    this.paperStatus = [];
  }

  updateStatus(alloted){
     return this.http.post('http://localhost:3000/paper/updateStatus', alloted)
      .subscribe(
        res => {
          this.getStatus();
        }
      );
}


  getStatus(): Observable<PaperStatus[]> {
      return this.http.get('http://localhost:3000/papers/getStatus')
      .map(res => {
        return res.json().map(item => {
           return new PaperStatus(
             item.subject_code,
             item.examiner_id,
             item.proposal,
             item.recieved
           );
         });
      });
    }
}
