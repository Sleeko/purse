import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { MemberService } from '../../services/member.service';
import { Member } from '../../model/member.model';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  code: string = 'AYko988H';
  members: Member [] = [];

  member: Member;

  //change this one to TRUE to reveal the SELLER PROFILE component.
  isSeller : boolean = false;

  constructor(private memberService: MemberService) { 
    const userInfoSession : any = JSON.parse(sessionStorage.getItem('userInfo'));
    this.code = userInfoSession.uid;
  }

  ngOnInit(): void {
    this.memberService.searchMemberCycle('H2WSM1').subscribe(e => {
        console.log('member', JSON.stringify(e));
        const d : any= {
            level: e.level,
            firstName: 'bjmramos@gmail.com',
            lastName: '',
            isActive: e.memberCycle.currentCycle === "INACTIVE" ? "INACTIVE" : "ACTIVE",
            cycle: e.memberCycle.currentCycle === "INACTIVE" ? "0" : e.memberCycle.currentCycle, 
            photoUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            registered: new Date()
        }
        this.members.push(d);
    })
  }



}
