
import { Component, OnInit} from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { MemberService } from '../../services/member.service';
import { UserInfo } from '../../model/user-info.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent, AdminUser } from '../create-user/create-user.component';

export class CodeDTO {
  code: string;
  isUsed: boolean;
}

@Component({
  templateUrl: 'admin-dashboard.component.html',
  styles: [`
    h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
    .product-style {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-size: 0.9rem;
    }
    .text-purse {
      color: #20853b;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currDate: Date = new Date();
  memberCode: CodeDTO [] = [];
  userInfo : UserInfo[] = [];
  memberList: any[] = [];
  userCounter: any = {
    membersCount: 0,
    inactiveMembers: 0,
    activeMembers: 0,
    profit: 0
  };

  virtualChamberStatus : any = [{
    id: 'LVL',
    count: 0,
    capacity: 100,
    usage: 0
  }]

  adminUsers : AdminUser[] = [];

  numUsers: number = 0;
  numMembers: number = 0;
  numSellers: number = 0;
  numAdmin: number = 0;

  constructor(private utilsService: UtilsService,
    private memberService: MemberService,
    private modalService : NgbModal) {}

  ngOnInit(): void {

  this.utilsService.getMemberCodeList().subscribe(res => {
    this.memberCode = res.map(e => ({code: e.memberCode, isUsed: e.used}));
   });
   
   this.memberService.getUserInfoCounter().subscribe(res => {
     this.userCounter = res;
   });

   this.memberService.getAllUser().subscribe(res => {
      res.forEach(element => {
        if (element.accountType === "ADMIN") {
          const admin = {
            email: element.email,
            role: element.accountType
          };
          this.adminUsers.push(admin);
        }
      });
   });

   //
   this.memberService.getVirtualChamberStatus().subscribe(e => {
      this.virtualChamberStatus =  e;
   });

   this.memberService.getMembers().subscribe(e=> {
     this.memberList = e;
     this.numMembers = e.filter(i => i.role === 'member').length;
     this.numSellers = e.filter(i => i.role === 'seller').length;
     this.numAdmin = e.filter(i => i.role === 'admin' || i.role === "staff").length;
     this.numUsers = Object.keys(e).length;

   })

  }

  createUser(){
    const userModal = this.modalService.open(CreateUserComponent, {backdrop: true, centered: true})
  }

}