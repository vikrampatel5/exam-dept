import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions, Headers } from '@angular/http';


export class ExaminerItem {
  constructor(
    public id: string,
    public name: string,
    public subject_code: string,
    public department: string,
    public address: string,
    public type: string,
    public email: string,
    public contact: string
  ) {}
}

@Injectable()
export class ExaminerService {

  public examiners: ExaminerItem[];

  addResponse: any;
  deleteResponse: any;

  constructor(private http: Http, private toasterService: ToasterService ) {
    this.examiners = [];
  }

  addExaminer(examiner) {
    return this.http.post('http://localhost:3000/examiner/add_examiner', examiner)
      .map(
        res => {
          // console.log(res.json());
          this.getExaminers();
          return res.json();
        }
      );
  }


  uploadFile(file) {
  return this.http.post('http://localhost:3000/examiner/upload_file', file)
      .map(
        res => {
          this.getExaminers();
          return res.json();
        }
      );
  }

  updateExaminer(examiner) {
    return this.http.post('http://localhost:3000/examiner/update_examiner', examiner)
      .map(
        res => {
          this.getExaminers();
          res.json();
        }
      );
  }

  deleteExaminer(id) {
    return this.http.delete('http://localhost:3000/examiner/delete_examiner/' + id)
      .map(
        res => {
          return res.json();
        }
      );
  }

  deleteAllExaminers(){
    return this.http.delete('http://localhost:3000/examiner/delete_all')
    .map(
      res => {
        return res.json();
      }
    )
  }

  getExaminers(): Observable<ExaminerItem[]> {
   return this.http
        .get('http://localhost:3000/examiner/get_examiners_list')
        .map(
          res => {
            // Success
            return res.json().map(item => {
             // console.log(item);
              return new ExaminerItem(
                item.id,
                item.name,
                item.Subject_Code,
                item.department,
                item.address,
                item.type,
                item.email,
                item.contact
              );
            });
          },
        );
  }
}
