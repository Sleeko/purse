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
  members: Member [] = [
    {
        'level': 'A',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': true,
        'cycle': 3,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'B',
        'firstName': 'BryanJudelle',
        'lastName': 'Ramos',
        'isActive': true,
        'cycle': 2,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'C',
        'firstName': 'Robert',
        'lastName': 'Horton',
        'isActive': false,
        'cycle': 2,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'D',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'E',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'F',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'A',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'A',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
    {
        'level': 'A',
        'firstName': 'Ariel Jay',
        'lastName': 'Fuentes',
        'isActive': false,
        'cycle': 1,
        'photoUrl': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        'registered': new Date()
    },
  ];

  member: Member;

  //change this one to TRUE to reveal the SELLER PROFILE component.
  isSeller : boolean = false;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    
  }



}
