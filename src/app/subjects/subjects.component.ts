import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectService, SubjectItem } from '../services/subject.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})



export class SubjectsComponent implements OnInit {
  subjects: SubjectItem[];

  subject = {
    Code: '',
    Nomenclature: '',
    group_id: ''
  };

  // File Reader---

  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }
  //

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
      this.getSubjects();
  }

  addSCode() {
    this.subjectService.addSCode(this.subject).subscribe(res => this.getSubjects());
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe(res => this.subjects = res);
  }

  deleteSubject(code) {
    console.log(code);
    this.subjectService.deleteSubject(code).subscribe(res => this.getSubjects());
  }

  Upload() {
    const fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();
          for ( let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          const myFile = XLSX.utils.sheet_to_json(worksheet, { raw: true});
          this.subjectService.uploadFile(myFile).subscribe(res => this.getSubjects());
      };
      fileReader.readAsArrayBuffer(this.file);
    }

   doit(type, fn, dl) {
    const json = this.subjectService.subjects;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    XLSX.writeFile(wb, fn || ('Subjects.' + (type || 'xlsx')));
}

}
