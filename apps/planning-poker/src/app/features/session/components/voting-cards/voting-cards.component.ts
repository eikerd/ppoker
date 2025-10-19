import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundService } from '../../../../core/services/sound.service';

@Component({
  selector: 'app-voting-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voting-cards.component.html',
  styleUrls: ['./voting-cards.component.scss']
})
export class VotingCardsComponent {
  @Input() disabled = false;
  @Output() cardSelected = new EventEmitter<number>();

  private soundService = inject(SoundService);

  cardValues = [1, 2, 3, 5, 7];
  selectedValue: number | null = null;

  selectCard(value: number): void {
    if (this.disabled) return;

    // If clicking the same card, unvote (deselect)
    if (this.selectedValue === value) {
      this.selectedValue = null;
      this.soundService.play('flip');
      this.cardSelected.emit(-1); // -1 signals an unvote
    } else {
      this.selectedValue = value;
      this.soundService.play('flip');
      this.cardSelected.emit(value);
    }
  }
}
