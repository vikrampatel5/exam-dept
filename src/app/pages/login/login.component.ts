import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myform: FormGroup;
  constructor() { }

  ngOnInit() {

      this.myform = new FormGroup({

      email: new FormControl('', [ 
          Validators.required,
          Validators.pattern("[^ @]*@[^ @]*") 
      ]),
      password: new FormControl('', [
          Validators.minLength(8), 
          Validators.required
      ]),
      language: new FormControl()
  });
  }

  login()
  {
    console.log("working");
  }

}
