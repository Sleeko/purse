import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { MemberService } from '../../services/member.service';
import { Member } from '../../model/member.model';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  code: string = 'REF_CODE';
  members: Member [] = [];

  member: Member;

  //change this one to TRUE to reveal the SELLER PROFILE component.
  isSeller : boolean = false;
  personalInfo: any;
  constructor(private memberService: MemberService) { 
    // const secondsCounter = interval(2000);
    // secondsCounter.subscribe(e => {
    //   const userInfoSession : any = JSON.parse(sessionStorage.getItem('userInfo'));
    //   this.code = userInfoSession.uid;
    //   this.personalInfo = userInfoSession.personalInfo;
    // });
  }

  ngOnInit(): void {
    // const secondsCounter = interval(2000);
    // secondsCounter.pipe(take(1)).subscribe(e => {
    //   this.memberService.searchMemberCycle(this.code).subscribe(e => {
    //     console.log('e', JSON.stringify(e));
    //     const d : any= {
    //         level: e.level,
    //         firstName: this.nullChecker(this.personalInfo.firstName),
    //         lastName: this.nullChecker(this.personalInfo.lastName),
    //         isActive: e.memberCycle.currentCycle === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    //         cycle: e.memberCycle.currentCycle === "INACTIVE" ? "0" : e.memberCycle.currentCycle, 
    //         photoUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    //         registered: new Date()
    //     }
    //     this.members.push(d);
    // })
    // });
  }

  nullChecker(value) {
    return value ? value : 'N/A';
  }

}
