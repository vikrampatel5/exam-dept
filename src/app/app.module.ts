import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ExaminersComponent } from './examiners/examiners.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { ExaminerService } from './services/examiner.service';
import { AllotedComponent } from './alloted/alloted.component';
import { FilterPipe } from './pipes/filter.pipe';
import { NotificationComponent } from './notification/notification.component';
import { HelpComponent } from './help/help.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { SubjectService } from './services/subject.service';
import { Http, HttpModule } from '@angular/http';
import { AllotedService } from './services/alloted.service';
import { PaperRecievedComponent } from './paper-recieved/paper-recieved.component';
import { UserService } from './services/users.service';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { UsersComponent } from './users/users.component';
import {ToasterModule, ToasterService} from 'angular5-toaster';


const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: '', component: DashboardHomeComponent, outlet:'sub'},
      {path: 'home', component: DashboardHomeComponent, outlet:'sub'},
      {path: 'alloted', component: AllotedComponent, outlet: 'sub'},
      {path: 'users', component: UsersComponent, outlet: 'sub'},
      {path: 'examiners', component: ExaminersComponent, outlet: 'sub'},
      {path: 'registerClerk', component: SignupComponent, outlet: 'sub'},
      {path: 'notification', component: NotificationComponent, outlet: 'sub'},
      {path: 'change-password', component: ChangePasswordComponent, outlet: 'sub'},
      {path: 'help', component: HelpComponent, outlet: 'sub'},
      {path: 'scode', component: SubjectsComponent, outlet: 'sub'},
      {path: 'paperRecieved', component: PaperRecievedComponent, outlet: 'sub'},
    ]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    ExaminersComponent,
    LoginComponent,
    DashboardComponent,
    ChangePasswordComponent,
    AllotedComponent,
    FilterPipe,
    NotificationComponent,
    HelpComponent,
    SubjectsComponent,
    PaperRecievedComponent,
    DashboardHomeComponent,
    UsersComponent
  ],
  imports: [
    ToasterModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    NgxPaginationModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ExaminerService, SubjectService, AllotedService, UserService],
  exports: [
    FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
