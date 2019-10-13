import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'purse.component.html',
  styleUrls: ['./purse.component.css']
})
export class PurseComponent implements OnInit {


  ngOnInit(): void {
  }

  layAwayPurse: number = 60;
}
