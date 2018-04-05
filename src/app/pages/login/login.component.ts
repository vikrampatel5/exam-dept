import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import { SignupService } from '../../services/signup.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myform: FormGroup;
  loginDetails = {
    uname: '',
    pass: ''
  }
  constructor(private signUpService: SignupService) { }

  ngOnInit() {

      this.myform = new FormGroup({

      email: new FormControl('', [ 
          Validators.required,
          Validators.email
      ]),
      password: new FormControl('', [
          Validators.minLength(8), 
          Validators.required
      ]),
      language: new FormControl()
  });
  }

  isValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }

  displayFieldCss(field: string) {
    if(this.isValid(field)){
      return 'has-error';
    }
    else if(!this.isValid(field)){
      return 'has-success';
    }
    else return ''
  }
  

  login()
  {
    console.log(this.loginDetails);
    this.signUpService.getUser(this.loginDetails).subscribe();
  }

}
