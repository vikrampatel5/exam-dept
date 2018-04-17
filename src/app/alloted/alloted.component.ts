import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { SubjectService, SubjectItem, CodeItem } from '../services/subject.service';
import { AllotedService, AllotedItem, EmailItem } from '../services/alloted.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';
import { forEach } from '@angular/router/src/utils/collection';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NotificationService } from '../services/notification.service';
import { ExaminerItem, ExaminerService } from '../services/examiner.service';

@Component({
  selector: 'app-alloted',
  templateUrl: './alloted.component.html',
  styleUrls: ['./alloted.component.css']
})
export class AllotedComponent implements OnInit {

  selectedValues = [];
  subjectGroups: CodeItem[];
  response: Object;
  message= '';
  emails = [];
  data = { };
  all : boolean;
  groups = [];
  myform: FormGroup;
  selectedAll: any;
  alloted_examiners: AllotedItem[] = [];
  allot = {
    subject_code: '',
    exam_code: '',
    examiner: '',
    type: ''
  };
  dupAllot : any;
  toAllot = [];

  ps_name = [];
  subjects: SubjectItem[];
  internal_examiners: any;
  allot_internal: any;
  external_examiners: any;
  allot_external: any;

  public selectedExaminerToNotify : EmailItem[] = [];

  constructor(private http: HttpClient,
    private subjectService: SubjectService,
    private examinerSerivce: ExaminerService,
    private allotedService: AllotedService,
    private toasterService: ToasterService,
    private notificationService: NotificationService
  ) {
      this.subjectGroups = [];
      this.allot = {
        subject_code: '',
        exam_code: '',
        examiner: '',
        type: ''
      };
     }

  ngOnInit() {
    this.getCodes();
    // console.log(this.subjects);
    this.getAlloted();
    // this.getSubjectGroups('BM29003');
    

    this.myform = new FormGroup({

      scode: new FormControl('', [
          Validators.required
      ]),
      internal: new FormControl(''),
      external: new FormControl(''),
  });
  }

  isValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }

  getCodes() {
    this.subjectService.getSubjects().subscribe(res => {
      this.subjects = res;
      // console.log(this.subjects);
    });
  }


  allotExaminers() {

    if(this.allot_internal === '' && this.allot_external === ''){
      this.toasterService.pop('info', 'No Examiner to Allot. Please Select atleast one');
      return;
    }
    else {
      if(this.allot_external != ''){
        this.dupAllot = {
          subject_code: this.allot.subject_code,
          examiner: this.allot_external,
          type: 'External'
        }
        this.toAllot.push(this.dupAllot);
      }
      if(this.allot_internal != ''){
        this.dupAllot = {
          subject_code: this.allot.subject_code,
          examiner: this.allot_internal,
          type: 'Internal'
        }
        this.toAllot.push(this.dupAllot);
      }
        this.allotedService.addAlloted(this.toAllot).subscribe(res => {
          if (res.status === true) {
            this.toasterService.pop('success', res.message);
            this.getAlloted();
          }
          else{
            this.toasterService.pop('error', res.message);
          }
        });
    }
    this.allot = {
      subject_code: '',
      exam_code: '',
      examiner: '',
      type: ''
    };
    this.allot_internal = '',
    this.allot_external = '',
    this.toAllot = [];
    this.closex();
  }

  getAlloted() {
    this.allotedService.getAlloted().subscribe(res => {
      this.alloted_examiners = res;
      for (let i = 0; i < this.alloted_examiners.length; i++){
        this.alloted_examiners[i]['selected'] = false;
        this.getSubjectGroups(this.alloted_examiners[i].subject_code);
      }
       console.log(this.alloted_examiners);
    });
  }

  deleteAlloted(id) {
    this.allotedService.deleteAlloted(id).subscribe(res => {
      if(res.status === false){
        this.toasterService.pop('error',res.message);
      }
      else{
        this.getAlloted();
        this.toasterService.pop('success',res.message);
      }
    });
  }

  deleteAllAlloted(){
    console.log(this.alloted_examiners);
    if(this.alloted_examiners.length===0){
      this.toasterService.pop('info',"No Details Found to Delete");
    }
    else{
        this.allotedService.deleteAllAlloted().subscribe(
          res => {
            if(res.status===true){
              this.toasterService.pop('success',res.message);
              this.getAlloted();
            }
          }
        )
      }
    }


  updateAlloted(alloted, idx) {
    if(this.ps_name[idx]===''){
      this.toasterService.pop("info","Please Select Papper Setter Name");
      return;
    }
    else{
      console.log(this.ps_name[idx]);
      this.allotedService.updateAlloted(alloted, this.ps_name[idx]).subscribe(res =>  this.getAlloted());
    }
   

  }

  doit(type, fn, dl) {
    if (this.alloted_examiners.length === 0){
      this.toasterService.pop("info","No Data Found To Export");
    }
    else{
      const json = this.allotedService.alloted;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
      XLSX.writeFile(wb, fn || ('Alloted_Examiners.' + (type || 'xlsx')));
      this.toasterService.pop("success","Data Exported Successfully");
    }
    
}


myFunction(code){
 // get internal Examiners for the subject
  this.http.get('http://localhost:3000/examiner/get_internal_examiners/'+code).subscribe(data => {
      this.internal_examiners = data;
      console.log(this.internal_examiners);
    });

    this.http.get('http://localhost:3000/examiner/get_external_examiners/'+code).subscribe(data => {
      this.external_examiners = data;
      console.log(this.external_examiners);
    });
  }

  // Select All Feature to be imeplemented  //

  toggleSelection(scode){
    const idx = this.selectedValues.indexOf(scode);
    if(idx > -1){
      this.selectedValues.splice(idx,1);
      this.alloted_examiners[idx]['selected'] = false;
    }
    else{
      this.selectedValues.push(scode);
      const idx = this.selectedValues.indexOf(scode);
      this.alloted_examiners[idx]['selected'] = true;
    }
    console.log(this.selectedValues);
  }


  selectAll(){
    if(this.selectedValues.length === this.alloted_examiners.length){
      this.alloted_examiners.map((item) => {
        item['selected']=false;
        this.selectedValues.pop();
        
      });
    }
    else {
      this.alloted_examiners.map((item) => {
        if(!this.selectedValues.includes(item.subject_code)){
          item['selected']=true;
          this.selectedValues.push(item.subject_code);
        }
      });
    }
    console.log(this.selectedValues);
  }

  getSubjectGroups(scode){
      this.subjectService.getSubjectGroups(scode).subscribe(res => {
       // this.subjectGroups = res;
       // console.log(this.subjectGroups);
        this.groups.push(res);
        // console.log(this.groups);
      })
  }

  openAddWindow() {
  
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  
    }
  
    closex() {
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }
  /**********************/ 


  /**************** Proposal Letter Generation ***********************/ 

  appointmentLetter() {
    this.http.get('http://localhost:3000/appointment/generate',{params: {codes: this.selectedValues}}).subscribe(
      (res:Response) => {
        this.toasterService.pop('info',res.body);
      }
    );
  }

 

  /*****************************************************************/ 
}
