import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

export class SubjectItem {
  constructor(
    public Code: string,
    public Nomenclature: string,
    public group_id: string
  ) {}
}

@Injectable()
export class SubjectService {
  subjects: SubjectItem[];
  addResponse: any;
  deleteResponse: any;

  constructor(private http: Http) {
    this.subjects = [];
  }

  addSCode(subject) {
    return this.http.post('http://localhost:3000/subject/add_subject', subject)
      .map(
        res => {
          this.getSubjects();
          return res.json();
        }
      );
  }

  deleteSubject(code) {
    return this.http.delete('http://localhost:3000/subject/delete_subject/' + code)
      .map(
        res => {
          return res.json();
        }
      );
  }

  uploadFile(file) {
    // console.log(file);
    return this.http.post('http://localhost:3000/subject/upload_file', file)
      .map(
        res => {
          console.log(res);
          return res.json();
        }
      );
  }

  getSubjects(): Observable<SubjectItem[]> {
   return this.http
        .get('http://localhost:3000/subject/get_subjects')
        .map(
          res => {
            // Success
            return res.json().map(item => {
              return new SubjectItem(item.Code, item.Nomenclature, item.group_id);
            });
          },
        );
  }

}
