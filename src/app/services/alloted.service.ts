import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { HttpParams } from '@angular/common/http';

export class AllotedItem {
  constructor(
    public id: number,
    public subject_code: string,
    public exam_code: string,
    public examiner: string,
    public type: string,
    public proposal: string,
    public proposal_sent: any,
    public recieved_time: any,
    public status: string
  ) {}
}

export class EmailItem{
  constructor(
    public email: string
    // public name: string
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

  deleteAlloted(id) {
    console.log('ID: '+id);
    return this.http.delete('http://localhost:3000/alloted/delete_alloted/' + id)
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
                item.id,
                item.subject_code,
                item.exam_code,
                item.examiner,
                item.type,
                item.proposal,
                item.proposal_sent,
                item.recieved_time,
                item.status
              );
          },
        );
      });
  }

  getSelectedEmail(codes): Observable<EmailItem[]>{
    return this.http
      .get('http://localhost:3000/alloted/get_selected_email', {params: {'codes': codes}})
      .map(
        res => {
          return res.json().map(item => {
            return new EmailItem(
              item.email
              // item.name
            );
          });
        },
      )
  }

}
