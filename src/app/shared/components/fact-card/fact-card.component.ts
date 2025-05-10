import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IFactResponse } from '@core/models/fact-response.interface';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';

@Component({
  selector: 'app-fact-card',
  templateUrl: './fact-card.component.html',
  styleUrls: ['./fact-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    IconButtonComponent,
  ],
})
export class FactCardComponent {
  @Input() fact!: IFactResponse;
  @Input() isFavorite = false;
  @Input() showDate = true;
  @Input() showFavoriteButton = true;
  @Input() showDeleteButton = false;

  @Output() favoriteClick = new EventEmitter<IFactResponse>();
  @Output() deleteClick = new EventEmitter<IFactResponse>();

  onFavoriteClick(): void {
    this.favoriteClick.emit(this.fact);
  }

  onDeleteClick(): void {
    this.deleteClick.emit(this.fact);
  }
}
