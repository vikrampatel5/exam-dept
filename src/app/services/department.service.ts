import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

export class DepartmentItem {
  constructor(
    public dept_code: string,
    public dept_name: string,
    public start: number,
    public end: number
  ) {}
}

@Injectable()
export class DepartmentService {

  constructor(private http: Http) { }

  addDepartment(dept) {
    return this.http.post('http://localhost:3000/department/add_department', dept)
      .map(
        res => {
          // console.log(res.json());
          return res.json();
        }
      );
  }

  getDepartment(): Observable<DepartmentItem[]> {
    return this.http
         .get('http://localhost:3000/department/get_departments')
         .map(
           res => {
             return res.json().map(item => {
               return new DepartmentItem(
                 item.dept_code,
                 item.dept_name,
                 item.start,
                 item.end
               );
             });
           },
         );
   }

   deleteDepartment(code) {
    return this.http.delete('http://localhost:3000/department/delete_department/' + code)
      .map(
        res => {
          return res.json();
        }
      );
  }

   deleteAllDepartments(){
    return this.http.delete('http://localhost:3000/department/delete_all')
    .map(
      res => {
        return res.json();
      }
    )
  }

  updateRange(dept) {
    return this.http.post('http://localhost:3000/department/update_range', dept)
      .map(
        res => {
          this.getDepartment();
          res.json();
        }
      );
  }

  uploadFile(file) {
    return this.http.post('http://localhost:3000/department/upload_file', file)
        .map(
          res => {
            this.getDepartment();
            return res.json();
          }
        );
    }
}
