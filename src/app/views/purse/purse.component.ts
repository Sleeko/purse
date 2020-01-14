import { Component, OnInit } from '@angular/core';
import { PurseService } from '../../services/purse.service';

@Component({
  templateUrl: 'purse.component.html',
  styleUrls: ['./purse.component.css']
})
export class PurseComponent implements OnInit {
  cashPurse: number = 0;
  layAwayPurse: number = 0;
  levelUpPurse: number = 0;
  reEntryPurse: number = 0;
  cycleMultiplier: number = 0;

  LVL_MAP: any = [
    {
      LVL: "LVL_P300",
      amount: 300 * 3
    },
    {
      LVL: "LVL_P500",
      amount: 500 * 3
    },
    {
      LVL: "LVL_P1K",
      amount: 1000 * 3
    },
    {
      LVL: "LVL_P5K",
      amount: 5000 * 3
    },
    {
      LVL: "LVL_P10K",
      amount: 10000 * 3
    },
    {
      LVL: "LVL_P20K",
      amount: 20000 * 3
    },
    {
      LVL: "LVL_P30K",
      amount: 30000 * 3
    }
  ];
  constructor(private purseService: PurseService) {}

  ngOnInit(): void {
    this.purseService.getPurses().subscribe(res => {
      console.log("data", JSON.stringify(res));
      if (res) {
        if ( res.cycleId === 0) {
          this.cycleMultiplier = 0;
        } else {
          this.cycleMultiplier = res.cycleId;
        }
      }
      else {
        res = {
          levelId: "LVL_P300",
          cycleId: 0,
        }
      }
      

      const levelVar : any = this.LVL_MAP.find(i => i.LVL === res.levelId);
      console.log('levelVar', JSON.stringify(levelVar));
      this.layAwayPurse = (levelVar.amount) * 0.25 * Number(this.cycleMultiplier);
      this.reEntryPurse = levelVar.amount / 3;
      this.cashPurse = ((levelVar.amount) * 0.20  + ( 6 + 4 ) )* this.cycleMultiplier;
      this.levelUpPurse = (levelVar.amount) * 0.06;
    });
  }

}
