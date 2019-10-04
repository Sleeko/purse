import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { MemberService } from '../../services/member.service';
import { Member } from '../../model/member.model';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  code: string ='AYko988H';
  members: Member [] = [
    {
        "level": "A",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": true,
        "cycle": 3
    },
    {
        "level": "B",
        "firstName": "BryanJudelle",
        "lastName": "Ramos",
        "isActive": true,
        "cycle": 2
    },
    {
        "level": "C",
        "firstName": "Robert",
        "lastName": "Horton",
        "isActive": false,
        "cycle": 2
    },
    {
        "level": "D",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
    {
        "level": "E",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
    {
        "level": "F",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
    {
        "level": "A",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
    {
        "level": "A",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
    {
        "level": "A",
        "firstName": "Ariel Jay",
        "lastName": "Fuentes",
        "isActive": false,
        "cycle": 1
    },
  ];
  
  member: Member;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.memberService.getMembers().subscribe(
      data=> {
        this.members = data;
        console.log(data);
      },
      err=> {
        //alert('error')
      }, 
      ()=> {

      }
    )
  }



}
