import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Password } from 'primeng/primeng';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm : FormGroup;
  roles = ['admin', 'member', 'seller'];

  constructor(
    private formBuilder : FormBuilder,
    private activeModal : NgbActiveModal
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username : ['', [Validators.required]],
      password : ['',[Validators.required]],
      role : ['', [Validators.required]]
    })
  }

  createNewUser(user : SampleUser){
    //TODO
  }

}

export class SampleUser{
  username : string;
  password : string;
  role : string;
}
