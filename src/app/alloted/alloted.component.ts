import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { SubjectService, SubjectItem } from '../services/subject.service';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-alloted',
  templateUrl: './alloted.component.html',
  styleUrls: ['./alloted.component.css']
})
export class AllotedComponent implements OnInit {

  alloted_examiners : AllotedItem[];
  allot = {
    subject_code: '',
    internal_examiner: '',
    external_examiner: '',
    ps_name: ''
  };

  ps_name: '';


  subjects: SubjectItem[];
  internal_examiners: any;
  external_examiners: any;

  constructor(private http: HttpClient,
    private subjectService: SubjectService,
    private allotedService: AllotedService) {
     }

  ngOnInit() {
    this.getCodes();
    this.getAlloted();
  }

  getCodes() {
    this.subjectService.getSubjects().subscribe(res => this.subjects = res);
  }


  allotExaminers() {
    this.allotedService.addAlloted(this.allot).subscribe(res => this.getAlloted());
  }

  getAlloted() {
    this.allotedService.getAlloted().subscribe(res => this.alloted_examiners = res);
  }

  deleteAlloted(scode) {
    this.allotedService.deleteAlloted(scode).subscribe(res => this.getAlloted());
  }

  updateAlloted(alloted) {
    this.allotedService.updateAlloted(alloted, this.ps_name).subscribe(res =>  this.getAlloted());

  }

  doit(type, fn, dl) {
    const json = this.allotedService.alloted;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    XLSX.writeFile(wb, fn || ('Alloted_Examiners.' + (type || 'xlsx')));
}


myFunction(code){
 // get internal Examiners for the subject
  this.http.get('http://localhost:3000/examiner/get_internal_examiners/'+code).subscribe(data => {
      this.internal_examiners = data;
    });

    this.http.get('http://localhost:3000/examiner/get_external_examiners/'+code).subscribe(data => {
      this.external_examiners = data;
    });
  }

  // Select All Feature to be imeplemented  //

  isAllChecked(){}
  checkAll(){}

  /**********************/ 
}
