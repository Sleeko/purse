import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeaturedContent } from '../../model/featured-content.model';
import { FeaturedContentService } from '../../services/featured-content.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss']
})
export class NewPageComponent implements OnInit {

   contentForm : FormGroup;
   image : File;

  constructor(
    private formBuilder : FormBuilder,
    private featuredContentService : FeaturedContentService,
    private cdr : ChangeDetectorRef) { }

  ngOnInit() {
    this.contentForm = this.formBuilder.group({
      description : ['', Validators.required],
      title : ['', Validators.required]
    });
  }

  onFileChange(event) {
 
    if(event.target.files && event.target.files.length) {
        this.image = event.srcElement.files[0]
        // need to run CD since file load runs outside of zone
        this.cdr.markForCheck();
      };
    
  }

  saveNewFeaturedContent(){
    var content : FeaturedContent;
    content = this.contentForm.getRawValue();
    console.log('Content ', content)
    this.featuredContentService.uploadImage(content, this.image);
  }

}
