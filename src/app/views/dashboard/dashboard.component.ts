import { Component, OnInit } from '@angular/core';
import { Member } from '../../model/member.model';
import { ChamberService } from '../../services/chamber.service';

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
  constructor(private chamberService: ChamberService) { 
    const sessData : any = JSON.parse(sessionStorage.getItem('currentUser'));
    this.code = sessData.userData.referralCode;

    //TODO:
    // add fetch service for user/member personal info
    //work around
    this.personalInfo = {
      firstName: sessData.userData.email,
      lastName: ""
    }
  }

  ngOnInit(): void {
    this.chamberService.getMemberChamber().subscribe(e => {
      for (let r of e) {
        const d : any= {
          level: r.levelId,
          firstName: this.nullChecker(this.personalInfo.firstName),
          lastName: this.nullChecker(this.personalInfo.lastName),
          isActive: r.status,
          cycle: r.cycleId === 0 ? "0" : String(r.cycleId), 
          photoUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
          registered: new Date()
        }
        this.members.push(d);
      }
    })
  }

  nullChecker(value) {
    return value ? value : 'N/A';
  }

}
