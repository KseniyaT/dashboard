import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFactResponse } from '../models/fact-response.interface';
import { LoggerService } from './logger.service';
import { FAVORITES_STORAGE_KEY } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites = new BehaviorSubject<IFactResponse[]>([]);

  constructor(private logger: LoggerService) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites);
        this.favorites.next(this.sortFavorites(favorites));
      } catch (error) {
        this.logger.error('Error parsing stored favorites', error, 'FavoritesService');
        this.favorites.next([]);
      }
    }
  }

  private saveFavorites(facts: IFactResponse[]): void {
    try {
      const sortedFacts = this.sortFavorites(facts);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(sortedFacts));
      this.favorites.next(sortedFacts);
    } catch (error) {
      this.logger.error('Error saving favorites', error, 'FavoritesService');
    }
  }

  private sortFavorites(facts: IFactResponse[]): IFactResponse[] {
    return [...facts].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }

  getAll(): Observable<IFactResponse[]> {
    return this.favorites.asObservable();
  }

  add(fact: IFactResponse): void {
    const currentFavorites = this.favorites.value;
    if (!this.isFavorite(fact.id)) {
      const factWithTimestamp = {
        ...fact,
        createdAt: new Date().toISOString(),
      };
      const updatedFavorites = [...currentFavorites, factWithTimestamp];
      this.saveFavorites(updatedFavorites);
    }
  }

  remove(fact: IFactResponse): void {
    const currentFavorites = this.favorites.value;
    const updatedFavorites = currentFavorites.filter(f => f.id !== fact.id);
    this.saveFavorites(updatedFavorites);
  }

  isFavorite(factId: string): boolean {
    return this.favorites.value.some(fact => fact.id === factId);
  }
}
