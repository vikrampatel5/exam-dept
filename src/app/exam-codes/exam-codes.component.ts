import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService, DepartmentItem } from '../services/department.service';

@Component({
  selector: 'app-exam-codes',
  templateUrl: './exam-codes.component.html',
  styleUrls: ['./exam-codes.component.css']
})
export class ExamCodesComponent implements OnInit {

  
  myform: any;
  examCodes = [
    {'examCode':'1001','dept':'CTA'},
    {'examCode':'2001','dept':'ME'},
    {'examCode':'2002','dept':'ME'}
  ];
    
  mappedSubjects = {
    "1001":[{'scode':'CT1003'},{'scode':'CT1005'}],
    "2001":[{'scode':'ME1008'},{'scode':'ME1001'}],
    "2002":[{'scode':'ME8801'}]
  }

  
  

  constructor() { }

  ngOnInit() {
  }

}
