import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeaturedContent } from '../../model/featured-content.model';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss']
})
export class NewPageComponent implements OnInit {

  private contentForm : FormGroup;

  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.contentForm = this.formBuilder.group({
      image : ['', Validators.required],
      description : ['', Validators.required],
      title : ['', Validators.required]
    });
  }

  saveNewFeaturedContent(){
    var content : FeaturedContent;
    content = this.contentForm.getRawValue();
    console.log('Content ' , content);
  }

}
