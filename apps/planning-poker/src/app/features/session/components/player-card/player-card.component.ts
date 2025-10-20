import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '@ppoker/shared/data-access';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player-card" [class.player-card--dealer]="player?.isDealer">
      <div class="player-card__avatar" style="font-size:24px; line-height:1">{{ player?.avatar }}</div>
      <div class="player-card__name">{{ player?.name }}</div>
      <div class="player-card__status" [class.player-card__status--voted]="hasVoted">
        <div class="card-icon" *ngIf="hasVoted">🂠</div>
        <div class="question-icon" *ngIf="!hasVoted">❓</div>
      </div>
      <div *ngIf="player?.isDealer" class="player-card__badge">Dealer</div>
    </div>
  `,
  styles: [`
    .player-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--card-radius);
      position: relative;

      &--dealer {
        border-color: var(--color-chip-gold);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);

        & .player-card__avatar {
          font-size: 24px;
          line-height: 1;
        }
      }

      &__avatar {
        /* avatar size reduced to 25% (24px) per design request */
          width: 64px;
        font-size: 24px;
        line-height: 1; /* prevent emoji from being vertically constrained */
      }

      &__name {
         
        font-family: var(--font-display);
          width: 200px;
        font-size: 16px;
        color: var(--color-text-light);
      }

      &__status {
        /* increased status icon size to match doubled avatars */
        
        font-size: 64px;
        padding: 8px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 200px;
        min-height: 200px;
        line-height: 1;

        &--voted {
          background: rgba(0, 100, 0, 0.3);
          border: 2px solid var(--color-chip-blue);
        }

        .card-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
          /* Make the card icon twice as big relative to the status font-size */
          font-size: 2em;
          line-height: 1;
        }

        .question-icon {
          opacity: 0.6;
          font-size: inherit;
          line-height: 1;
        }
      }

      &__badge {
        position: absolute;
        top: 4px;
        right: 4px;
        background: var(--color-chip-gold);
        color: var(--color-text-dark);
        padding: 2px 6px;
        font-size: 10px;
        border-radius: 4px;
        font-weight: bold;
      }
    }
  `]
})
export class PlayerCardComponent {
  @Input() player: Player | null = null;
  @Input() hasVoted = false;
  @Input() isDealer = false;
}
