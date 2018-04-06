import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { SubjectService, SubjectItem } from '../services/subject.service';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-alloted',
  templateUrl: './alloted.component.html',
  styleUrls: ['./alloted.component.css']
})
export class AllotedComponent implements OnInit {

  selectedAll: any;
  alloted_examiners: AllotedItem[];
  allot = {
    subject_code: '',
    internal_examiner: '',
    external_examiner: '',
    ps_name: ''
  };

  ps_name: '';

  selection = [];

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
    this.subjectService.getSubjects().subscribe(res => {
      this.subjects = res;
    });
  }


  allotExaminers() {
    this.allotedService.addAlloted(this.allot).subscribe(res => this.getAlloted());
  }

  getAlloted() {
    this.allotedService.getAlloted().subscribe(res => {
      this.alloted_examiners = res;
      for (let i = 0; i < this.alloted_examiners.length; i++) { 
        this.alloted_examiners[i]['selected']=false;
      } 
      // console.log(this.alloted_examiners);
    });
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

  toggleSelection(scode){
    const idx = this.selection.indexOf(scode);
    if(idx > -1){
      this.selection.splice(idx,1);
      this.alloted_examiners[idx]['selected'] = false;
    }
    else{
      this.selection.push(scode);
      const idx = this.selection.indexOf(scode);
      this.alloted_examiners[idx]['selected'] = true;
    }
    console.log(this.selection);
  }

  selectAll() {
    this.selection = [];
    for (var i = 0; i < this.alloted_examiners.length; i++) {
      this.alloted_examiners[i]['selected'] = this.selectedAll;
      if(this.alloted_examiners[i]['selected'])
        this.selection.push(this.alloted_examiners[i].subject_code);

    }
    console.log(this.selection);
  }
  checkIfAllSelected() {
    this.selectedAll = this.alloted_examiners.every(function(item:any) {
        return item['selected'] == true;
      })
  }

  /**********************/ 
}
