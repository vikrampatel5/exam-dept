import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../services/signup.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

 clerk = {
  id : '',
  name : '',
  email : '',
  password : '',
  cpassword : ''
 }
  constructor(private signUpService: SignupService ) { }

  ngOnInit() {
  }

  addClerk() {
    this.signUpService.addClerk(this.clerk);
  }
}
