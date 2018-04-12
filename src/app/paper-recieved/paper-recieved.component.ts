import { Component, OnInit } from '@angular/core';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
declare const $;

@Component({
  selector: 'app-paper-recieved',
  templateUrl: './paper-recieved.component.html',
  styleUrls: ['./paper-recieved.component.css']

})
export class PaperRecievedComponent implements OnInit {

  // alloted_examiners: AllotedItem[];
  codes =  ['BM2951', 'BM4953'];
  alloted_examiners: AllotedItem[];

  options = ['Not Generated', 'Generated'];
  status: '';
  proposal: '';

  constructor(private allotedService: AllotedService, private http: HttpClient) { }

  ngOnInit() {
    this.getStatus();
  }

  updateStatus(alloted, ps_name) {
    console.log(ps_name);
    if (alloted.status !== '') {
      alloted.status = this.status;
    }
    if (alloted.proposal !== '') {
      alloted.proposal = this.proposal;
    }

    this.allotedService.updateAlloted(alloted, ps_name).subscribe(res => this.getStatus());
  }

  getStatus() {
    this.allotedService.getAlloted().subscribe(res => this.alloted_examiners = res);
  }

 

  doit(type, fn, dl) {
    const json = this.alloted_examiners;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['status'] };
    XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    XLSX.writeFile(wb, fn || ('Received_Status.' + (type || 'xlsx')));
}
}
