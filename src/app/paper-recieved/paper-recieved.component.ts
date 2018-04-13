import { Component, OnInit } from '@angular/core';
import { AllotedService, AllotedItem, EmailItem } from '../services/alloted.service';
import { HttpClient } from '@angular/common/http';
import {CheckboxModule} from 'primeng/checkbox';
import * as XLSX from 'xlsx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { NotificationService } from '../services/notification.service';
declare const $;

@Component({
  selector: 'app-paper-recieved',
  templateUrl: './paper-recieved.component.html',
  styleUrls: ['./paper-recieved.component.css']

})
export class PaperRecievedComponent implements OnInit {

  data: { to: any; subject: string; text: string; };
  emails = [];
  public selectedExaminerToNotify : EmailItem[] = [];
  // alloted_examiners: AllotedItem[];
  codes =  ['BM2951', 'BM4953'];
  alloted_examiners: AllotedItem[];
  selectedValues= [];
  options = ['Not Generated', 'Generated'];
  status: '';
  proposal: '';

  constructor(private allotedService: AllotedService,
     private http: HttpClient,
    private notificationService: NotificationService,
    private toasterService: ToasterService,
  ) { }

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

notify() {
  
 
    
  this.allotedService.getSelectedEmail(this.selectedValues).subscribe(
    res => {
      setTimeout(() => {
        this.selectedExaminerToNotify = res;
      }, 3000);
     
    }
  );


    this.selectedExaminerToNotify.map(item => this.emails.push(item.email));
 // console.log(this.selectedExaminerToNotify);

this.data = {
  to : this.emails,
  subject: 'Just For Fun',
  text: 'This is Custom Messsage'
}
this.sendMail();

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

}
