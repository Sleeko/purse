
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

export class VCReport {
  uid: number;
  name: string;
  email: string;
  level: string;
  cycle: string;
  isActive: boolean;
  layaway: number;
  cash: number;
  reentry: number;
  levelUp: number;
  dateRegistered: Date;
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

  // virtual chamber report property
  vcReport: VCReport[] = [];
  vcCols: any[];

  constructor(private utilsService: UtilsService,
    private memberService: MemberService,
    private modalService : NgbModal) {}

  ngOnInit(): void {

  this.utilsService.getMemberCodeList().subscribe(res => {
    this.memberCode = res.map(e => ({code: e.memberCode, isUsed: e.used}));
   });

   //--
   // fetch virtual chamber reports
   //--
   this.utilsService.getVirtualChamberReport().subscribe(res => {
    this.vcReport = res.map(e => (
      {
        uid: e.uid,
        name: e.name,
        email: e.email,
        level: e.levelId,
        cycle: e.currentCycle,
        isActive: Number(e.currentCycle) > 0 ? true : false,
        layaway: e.layAwayPurse,
        cash: e.cashPurse,
        reentry: e.reEntryPurse,
        levelUp: e.levelUpPurse,
        dateRegistered: e.dateRegistered
      }
      ));
   });

   this.vcCols = [
        { field: 'uid', header: 'User ID' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
        { field: 'level', header: 'Level' },
        { field: 'cycle', header: 'Cycle' },
        { field: 'layaway', header: 'Status' },
        { field: 'layaway', header: 'Layaway Purse' },
        { field: 'cash', header: 'Cash Purse' },
        { field: 'reentry', header: 'Re-Entry Purse' },
        { field: 'levelUp', header: 'Level-Up Purse' },
        { field: 'dateRegistered', header: 'Date Registered' }
    ];
   
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
   const ARR_MAP = [
    'LVL_P300', 'LVL_P500', 'LVL_P1K', 'LVL_P5K',
    'LVL_P10K', 'LVL_P20K', 'LVL_P30K',
  ];
   this.memberService.getVirtualChamberUser().subscribe(e => {
      let accumulator = [];
      for (let obj of ARR_MAP) {
        const lvlObj = e.filter((x) => x.levelId === obj && x.cycleId > 0).length
        const pushObj = {
          id: obj, 
          count: lvlObj, 
          capacity: 50,
          usage: (lvlObj / 50) * 100
        };

        accumulator.push(pushObj);
      }
    
      this.virtualChamberStatus =  accumulator;
   });

   this.memberService.getAllUser().subscribe(e=> {
     this.memberList = e;
     this.numMembers = e.filter(i => i.accountType === 'MEMBER').length;
     this.numSellers = e.filter(i => i.accountType === 'SELLER').length;
     this.numAdmin = e.filter(i => i.accountType === 'ADMIN').length;
     this.numUsers = Object.keys(e).length;

   })

  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.vcReport);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "virtual_chamber_report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
}

createUser(){
    const userModal = this.modalService.open(CreateUserComponent, {backdrop: true, centered: true})
  }

}