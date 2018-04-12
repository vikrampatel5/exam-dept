import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';
import { SubjectService, SubjectItem, CodeItem } from '../services/subject.service';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';
import { forEach } from '@angular/router/src/utils/collection';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-alloted',
  templateUrl: './alloted.component.html',
  styleUrls: ['./alloted.component.css']
})
export class AllotedComponent implements OnInit {

  subjectGroups: CodeItem[];
  message= '';
  data = {
    to : 'vikrampatel5@gmail.com',
    subject: 'Just For Fun',
    text: 'This is Custom Messsage'
  };
  groups = [];
  myform: FormGroup;
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
  arr = [];
  subjects: SubjectItem[];
  internal_examiners: any;
  external_examiners: any;


  public selectedExaminerToNotify = [];

  constructor(private http: HttpClient,
    private subjectService: SubjectService,
    private allotedService: AllotedService,
    private toasterService: ToasterService
  ) {
      this.subjectGroups = []
     }

  ngOnInit() {
    this.getCodes();
    this.getAlloted();
    //this.getSubjectGroups('BM29003');

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
    if(this.allot.internal_examiner==='' && this.allot.external_examiner===''){
      this.toasterService.pop('info','No Examiner to Allot. Please Select atleast one')
      return;
    }
    else{
      this.allotedService.addAlloted(this.allot).subscribe(res => {
        if(res.status===true){
          this.toasterService.pop('success',res.message);
        }
        this.getAlloted()
      });

    }
    this.closex();
  }

  getAlloted() {
    this.allotedService.getAlloted().subscribe(res => {
      this.alloted_examiners = res;
      for (let i = 0; i < this.alloted_examiners.length; i++) { 
        this.alloted_examiners[i]['selected']=false;
        this.getSubjectGroups(this.alloted_examiners[i].subject_code);
      } 
      console.log(this.alloted_examiners);
    });
  }

  deleteAlloted(scode) {
    this.allotedService.deleteAlloted(scode).subscribe(res => {
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


  updateAlloted(alloted) {
    if(this.ps_name===''){
      this.toasterService.pop("info","Please Select Papper Setter Name");
      return;
    }
    else{
      this.allotedService.updateAlloted(alloted, this.ps_name).subscribe(res =>  this.getAlloted());
    }
   

  }

  doit(type, fn, dl) {
    if(this.alloted_examiners.length===0){
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

  getSubjectGroups(scode){
      this.subjectService.getSubjectGroups(scode).subscribe(res => {
       // this.subjectGroups = res;
       console.log(this.subjectGroups);
        this.groups.push(res);
        console.log(this.groups);
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


  /*************Notification and Email***************************/ 

  appointmentLetter() {
    this.http.get('http://localhost:3000/appointment/generate').subscribe();
  }

  notify() {
    let emails = [];
    for(let code of this.selection){
      this.allotedService.getSelectedEmail(code).subscribe(res => {
        this.selectedExaminerToNotify.push(res);
      });
    }
    for(let examiner of this.selectedExaminerToNotify){
        emails.push(examiner.email);
    }
    console.log(this.selectedExaminerToNotify);
    console.log(emails);
    this.sendMail();
    // Write code for sending sms
  }

  sendMail() {

    this.message = 'Sending E-mail please wait...';
    this.http.post('http://localhost:3000/notify/send_mail', this.data).subscribe(res => {
       if (res) {
         this.message = 'Message Sent Successfully';
       }
    });
  }



  /*****************************************************************/ 
}
