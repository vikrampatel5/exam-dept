import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { HttpParams } from '@angular/common/http';

export class AllotedItem {
  constructor(
    public subject_code: string,
    public internal_examiner: string,
    public internal_id: number,
    public external_id: number,
    public external_examiner: string,
    public ps_name: string,
    public proposal: string,
    public status: string
  ) {}
}

export class EmailItem{
  constructor(
    public email: string,
    public name: string
  ){}
}

@Injectable()
export class AllotedService {

  alloted: AllotedItem[];

  addResponse: any;
  deleteResponse: any;

  constructor(private http: Http) {
    this.alloted = [];
  }

  addAlloted(allot) {
    return this.http.post('http://localhost:3000/alloted/add_alloted', allot)
      .map(
        res => {
          return res.json();
        }
      );
  }
  updateAlloted(alloted, ps_name) {
    alloted.ps_name = ps_name;
    return this.http.post('http://localhost:3000/alloted/update_alloted', alloted)
      .map(
        res => {
          return res.json();
        }
      );
  }

  deleteAlloted(scode) {
    return this.http.delete('http://localhost:3000/alloted/delete_alloted/' + scode)
      .map(
        res => {
          return res.json();
        }
      );
  }

  deleteAllAlloted(){
    return this.http.delete('http://localhost:3000/alloted/delete_all')
      .map(
        res => {
          return res.json();
        }
      );
  }

  getAlloted(): Observable<AllotedItem[]> {
      return this.http
        .get('http://localhost:3000/alloted/get_alloted_list')
        .map(
          res => {
            // Success
            return res.json().map(item => {
              return new AllotedItem(
                item.subject_code,
                item.internal_examiner,
                item.internal_id,
                item.external_id,
                item.external_examiner,
                item.ps_name,
                item.proposal,
                item.status,
              );
          },
        );
      });
  }

  getSelectedEmail(codes): Observable<EmailItem[]>{
    //console.log(codes);
    // const params = new HttpParams().set('codes', codes);
    // console.log(params);
    return this.http
      .get('http://localhost:3000/alloted/get_selected_email', {params: {'codes': codes}})
      .map(
        res => {
          return res.json().map(item => {
            // console.log(res);
            return new EmailItem(
              item.email,
              item.name
            )
          })
        }
      )
  }

}
