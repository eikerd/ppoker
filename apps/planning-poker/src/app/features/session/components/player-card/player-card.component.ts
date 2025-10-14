import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '@ppoker/shared/data-access';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player-card" [class.player-card--dealer]="player?.isDealer">
      <div class="player-card__avatar">{{ player?.avatar }}</div>
      <div class="player-card__name">{{ player?.name }}</div>
      <div class="player-card__status" [class.player-card__status--ready]="hasVoted">
        {{ hasVoted ? '✓ Ready' : '🤔 Thinking' }}
      </div>
      <div *ngIf="player?.isDealer" class="player-card__badge">Dealer</div>
    </div>
  `,
  styles: [`
    .player-card {
      display: flex;
      flex-direction: column;
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
      }

      &__avatar {
        font-size: 48px;
      }

      &__name {
        font-family: var(--font-display);
        font-size: 16px;
        color: var(--color-text-light);
      }

      &__status {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);

        &--ready {
          background: var(--color-chip-blue);
          color: white;
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
