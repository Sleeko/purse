import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Password } from 'primeng/primeng';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

export class AdminUser{
  email : string;
  role : string;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm : FormGroup;
  roles = ['admin', 'dept_head', 'staff'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder : FormBuilder,
    private activeModal : NgbActiveModal
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email : ['', [Validators.required,Validators.email]],
      password : ['',[Validators.required]],
      role : ['', [Validators.required]]
    })
  }

  createAdminUser(formData){
    const req = {
      email: formData.email,
      password: formData.password,
      role: formData.role
    }

    const payload = { email: req.email, password: req.password };
    this.doCreateAdminUser(req, payload);
  }

  doCreateAdminUser(reqObj, authObj) {
    this.authService.doRegister(authObj)
    .then(res => {
      console.log('Account ID', res.user.uid);
      const userInfoPayload = {
        authId: res.user.uid,
        uid: Math.random().toString(36).substring(6).toUpperCase(),
        email: res.user.email,
        personalInfo: {},
        accountInfo: {},
        governmentDocuments: {},
        dateRegistered: new Date(),
        role: reqObj.role
      };

      // saving seller data
      this.userService.saveUserInfo(userInfoPayload).then(data => {
        console.log('account creation', data);
      }).catch(error => {
        console.log('error', error);
      });

      alert('Your admin account was successfully created!.')
      this.activeModal.close();
    }, err => {
      console.log(err.message);
      alert(err.message);
    });
  }
}