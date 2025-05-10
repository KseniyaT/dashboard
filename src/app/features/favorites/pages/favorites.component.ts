import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoritesService } from '@core/services/favorites.service';
import { IFactResponse } from '@core/models/fact-response.interface';
import { Subscription } from 'rxjs';
import { SearchComponent } from '@shared/components/search/search.component';
import { FactCardComponent } from '@shared/components/fact-card/fact-card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '@core/services/logger.service';
import { SortButtonComponent } from '@shared/components/sort-button/sort-button.component';
import { SortDirection } from '@shared/components/sort-button/sort-button.types';
import {
  ITEMS_PER_PAGE,
  SCROLL_THRESHOLD,
  LOADING_SPINNER_DIAMETER,
} from '@core/constants/ui.constants';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    SearchComponent,
    FactCardComponent,
    SortButtonComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  readonly LOADING_SPINNER_DIAMETER = LOADING_SPINNER_DIAMETER;
  allFavorites: IFactResponse[] = [];
  displayedFavorites: IFactResponse[] = [];
  private subscription: Subscription;
  isLoading = false;
  private currentPage = 1;
  private destroy$ = new Subject<void>();
  currentSortDirection: SortDirection = 'desc';
  isItemSelected = false;
  selectedFact: IFactResponse | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoritesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: favorites => {
          this.allFavorites = this.sortFavorites(favorites);
          this.displayedFavorites = [...this.allFavorites];
          this.isLoading = false;
        },
        error: error => {
          this.logger.error('Error loading favorites', error, 'FavoritesComponent');
          this.snackBar.open('Error loading favorites', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  private updateDisplayedFavorites(): void {
    const startIndex = 0;
    const endIndex = this.currentPage * ITEMS_PER_PAGE;
    this.displayedFavorites = this.allFavorites.slice(startIndex, endIndex);
  }

  onSearch(searchText: string): void {
    if (!searchText) {
      this.isItemSelected = false;
      this.selectedFact = null;
      this.displayedFavorites = [...this.allFavorites];
      return;
    }
    if (this.isItemSelected && this.selectedFact && searchText === this.selectedFact.text) {
      this.displayedFavorites = [this.selectedFact];
      return;
    }
    this.isItemSelected = false;
    this.selectedFact = null;
    this.displayedFavorites = this.allFavorites.filter(fact =>
      fact.text.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  onItemSelected(item: IFactResponse | null): void {
    if (!item) {
      this.isItemSelected = false;
      this.selectedFact = null;
      this.displayedFavorites = [...this.allFavorites];
      return;
    }
    this.isItemSelected = true;
    this.selectedFact = item;
    this.displayedFavorites = [item];
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isLoading || this.displayedFavorites.length >= this.allFavorites.length) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - SCROLL_THRESHOLD) {
      this.currentPage++;
      this.updateDisplayedFavorites();
    }
  }

  removeFromFavorites(fact: IFactResponse): void {
    this.favoritesService.remove(fact);
    this.allFavorites = this.allFavorites.filter(f => f.id !== fact.id);
    this.displayedFavorites = this.displayedFavorites.filter(f => f.id !== fact.id);
    this.snackBar.open('Fact removed from favorites', 'Close', {
      duration: 3000,
    });
  }

  onSort(direction: SortDirection): void {
    this.currentSortDirection = direction;
    this.allFavorites = this.sortFavorites(this.allFavorites);
    this.displayedFavorites = [...this.allFavorites];
  }

  private sortFavorites(favorites: IFactResponse[]): IFactResponse[] {
    return [...favorites].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.currentSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
}
