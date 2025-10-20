import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '@ppoker/shared/data-access';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent {
  @Input() player: Player | null = null;
  @Input() hasVoted = false;
  @Input() isDealer = false;
}
