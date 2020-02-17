import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeaturedContent } from '../../model/featured-content.model';
import { FeaturedContentService } from '../../services/featured-content.service';
import { AppConstants } from '../../app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss']
})
export class NewPageComponent implements OnInit {

  contentForm: FormGroup;
  image: File;
  featuredContents: FeaturedContent[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private featuredContentService: FeaturedContentService,
    private spinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private growlService: ToastrService) { }

  ngOnInit() {
    this.contentForm = this.formBuilder.group({
      description: ['', Validators.required],
      title: ['', Validators.required]
    });
    this.getAllFeaturedContents();
  }

  getAllFeaturedContents() {
    this.featuredContentService.getAllFeaturedContent().subscribe(data => {
      this.featuredContents = data;
      console.log('featured ', this.featuredContents)
    })
  }

  updateFeatured(featured: FeaturedContent) {
    this.featuredContentService.uploadImage(this.image,featured).then(res => {
      featured.imageUrl = res;
      this.featuredContentService.updateFeaturedContent(featured).subscribe(
        data => {
          console.log(data)
          this.growlService.success('Featured Content Updated', 'Success');
        },
        err => {
          this.growlService.error('Failed to update content', 'Error');
        },
        () => {
          this.spinnerService.hide();
        }
      )
    });

 
  }

  deleteFeaturedContent(featured: FeaturedContent) {
    this.spinnerService.show()
    this.featuredContentService.deleteFeaturedContent(featured).subscribe(
      data => {
        this.growlService.success('Featured Content Deleted', 'Success');
      },
      err => {
        this.growlService.error('Failed to delete content', 'Error');
      },
      () => {
        this.spinnerService.hide();
      }
    )
  }

  // onFileChange(event) {

  //   if (event.target.files && event.target.files.length) {
  //     this.image = event.srcElement.files[0]
  //     // need to run CD since file load runs outside of zone
  //     this.cdr.markForCheck();
  //   };

  // }

  onFileChange(event, index, fc :  FeaturedContent){
    this.image = event.target.files[0];
  }

  saveNewFeaturedContent() {
    var content: FeaturedContent;
    content = this.contentForm.getRawValue();
    content.status = AppConstants.ACTIVE;
    this.featuredContentService.uploadImage(this.image,content)
    this.contentForm.reset();
  }

}
