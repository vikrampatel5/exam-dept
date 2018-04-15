import { Component, OnInit } from '@angular/core';
import { AllotedService, AllotedItem, EmailItem } from '../services/alloted.service';
import { HttpClient } from '@angular/common/http';
import {CheckboxModule} from 'primeng/checkbox';
import * as XLSX from 'xlsx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { NotificationService } from '../services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as quill from 'quill';

declare const $;

@Component({
  selector: 'app-paper-recieved',
  templateUrl: './paper-recieved.component.html',
  styleUrls: ['./paper-recieved.component.css']

})
export class PaperRecievedComponent implements OnInit {

  text1: string;
  myform: FormGroup;
  data: { to: any, subject: string, html: string };
  emails = [];

  public selectedExaminerToNotify : EmailItem[] = [];

  alloted_examiners: AllotedItem[];
  selectedValues = [];
  public status = [];
  public proposal = [];

  constructor(private allotedService: AllotedService,
     private http: HttpClient,
    private notificationService: NotificationService,
    private toasterService: ToasterService,
  ) { 
    this.data = {
      to : [],
      subject: '',
      html: ''
    }

  }

  ngOnInit() {
    this.getStatus();

    this.myform = new FormGroup({

      text: new FormControl('', [
          Validators.required
      ]),
      subject: new FormControl('')
  });
  }

  updateStatus(alloted, ps_name, idx) {
   
    if (alloted.status !== '') {
      alloted.status = this.status[idx];
    }
    if (alloted.proposal !== '') {
      alloted.proposal = this.proposal[idx];
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

async notify() {
    
  await this.allotedService.getSelectedEmail(this.selectedValues).toPromise().then(
    res => {
      this.selectedExaminerToNotify = res;
    }
  );

  this.selectedExaminerToNotify.map(item => this.emails.push(item.email));
 // console.log(this.selectedExaminerToNotify);

  this.data.to = this.emails;
  this.sendMail();
  this.closex();
}

sendMail() {
// console.log(this.data);
//this.message = 'Sending E-mail please wait...';
this.notificationService.sendMail(this.data).subscribe(res => {
  if(res.status === true){
    this.toasterService.pop('success',res.message);
  }
  else{
    this.toasterService.pop('error',res.message);
  }
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


  openAddWindow() {
    if(this.selectedValues.length===0){
      this.toasterService.pop('info',"Please Select Atleast one E-record");
      this.closex();
    }
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
    }
  
    closex() {
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }


    isValid(field: string) {
      return !this.myform.get(field).valid && this.myform.get(field).touched;
    }

    
}
