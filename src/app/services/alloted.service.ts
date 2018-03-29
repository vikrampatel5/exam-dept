import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class AllotedItem {
  constructor(
    public subject_code: string,
    public internal_examiner: string,
    public external_examiner: string,
    public ps_name: string,
    public proposal: string,
    public status: string
  ) {}
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
          res.json();
        }
      );
  }
  updateAlloted(alloted, ps_name) {
    alloted.ps_name = ps_name;
    return this.http.post('http://localhost:3000/alloted/update_alloted', alloted)
      .map(
        res => {
          res.json();
        }
      );
  }

  deleteAlloted(scode) {
    return this.http.delete('http://localhost:3000/alloted/delete_alloted/' + scode)
      .map(
        res => {
          console.log('Alloted Examiner For Subject Code ' + res.json().scode + ' is Deleted!!');
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
                item.external_examiner,
                item.ps_name,
                item.proposal,
                item.status
              );
          },
        );
      });
  }

  private handleError(error: any) {
    const errMsg = error.message
      ? error.message
      : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
