import { Component, OnInit } from '@angular/core';
import { DotaService } from 'src/app/services/dota.service';

@Component({
  selector: 'app-live-game',
  templateUrl: './live-game.component.html',
  styleUrls: ['./live-game.component.scss']
})
export class LiveGameComponent implements OnInit{
  data: any;
  
  constructor(private dotaService: DotaService){

  }
  ngOnInit(): void {
    const playerId = '97658618';
    
    this.dotaService.getPlayerLiveGame(playerId).subscribe(data => {
      this.data = data;
    })

  }

}
