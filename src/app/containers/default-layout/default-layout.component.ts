import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../model/user-info.model';
import { AppConstants } from '../../app.constants';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  public navItems = [];
  navItemsFiltered = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  private currentUser : UserInfo = new UserInfo();
  constructor(
    public authService: AuthService, 
    public router: Router, 
    private userService : UserService,
    @Inject(DOCUMENT) _document?: any,
     ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  ngOnInit(){
   this.getCurrentUser();
  }

  getCurrentUser(){
    this.userService.getCurrentUser().then(res => {
      this.userService.getUserDetails(res.email).subscribe(e => {
        const response = e.map(obj => ({
          docId : obj.payload.doc.id,
          ...obj.payload.doc.data()
        } as UserInfo))
        this.currentUser = response[0];
        this.removeNonAdminTabs(this.currentUser.role)
      })
    })
  }

  removeNonAdminTabs(role){
    var navItemsArray = navItems;
 
    if(role != AppConstants.ADMIN){
     navItemsArray.splice(navItemsArray.findIndex(nav => nav.name == "New Page"),1);
     navItemsArray.splice(navItemsArray.findIndex(nav => nav.name == "Admin Dashboard"),1);
    }
    this.navItemsFiltered = navItemsArray;
   }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }

  accountSettings(){
    this.router.navigate(['/account-settings']);
  }
}
