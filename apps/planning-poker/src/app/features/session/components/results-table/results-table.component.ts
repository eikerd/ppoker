import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vote, VoteStatistics } from '@ppoker/shared/data-access';

@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent {
  @Input() votes: Vote[] = [];
  @Input() statistics: VoteStatistics | null = null;

  isOutlier(vote: Vote): boolean {
    return this.statistics?.outliers.includes(vote.playerId) || false;
  }
}
