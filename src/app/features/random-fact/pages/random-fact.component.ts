import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFactResponse } from '@core/models/fact-response.interface';
import { FactsApiService } from '@core/services/facts-api.service';
import { FavoritesService } from '@core/services/favorites.service';
import { FactCardComponent } from '@shared/components/fact-card/fact-card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-random-fact',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FactCardComponent,
  ],
  templateUrl: './random-fact.component.html',
  styleUrls: ['./random-fact.component.scss'],
})
export class RandomFactComponent implements OnInit, OnDestroy {
  currentFact: IFactResponse | null = null;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private factsApiService: FactsApiService,
    private favoritesService: FavoritesService,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}

  ngOnInit(): void {
    this.loadRandomFact();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getNewFact(): void {
    this.loadRandomFact();
  }

  loadRandomFact(): void {
    this.isLoading = true;
    this.error = null;
    this.factsApiService
      .getRandomFact()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: fact => {
          this.currentFact = fact;
          this.isLoading = false;
        },
        error: error => {
          this.logger.error('Error loading random fact', error, 'RandomFactComponent');
          this.error = 'Failed to load random fact';
          this.snackBar.open('Error loading random fact', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  isFavorite(): boolean {
    if (!this.currentFact) return false;
    return this.favoritesService.isFavorite(this.currentFact.id);
  }

  saveToFavorites(): void {
    if (!this.currentFact) return;
    this.favoritesService.add(this.currentFact);
    this.snackBar.open('Fact added to favorites', 'Close', {
      duration: 3000,
    });
  }

  removeFromFavorites(): void {
    if (!this.currentFact) return;
    this.favoritesService.remove(this.currentFact);
    this.snackBar.open('Fact removed from favorites', 'Close', {
      duration: 3000,
    });
  }
}
