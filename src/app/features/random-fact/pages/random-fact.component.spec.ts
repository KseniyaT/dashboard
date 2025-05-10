import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RandomFactComponent } from './random-fact.component';
import { FactsApiService } from '@core/services/facts-api.service';
import { FavoritesService } from '@core/services/favorites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFactResponse } from '@core/models/fact-response.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from '@core/services/logger.service';

describe('RandomFactComponent', () => {
  let component: RandomFactComponent;
  let fixture: ComponentFixture<RandomFactComponent>;
  let factsApiService: jest.Mocked<FactsApiService>;
  let favoritesService: jest.Mocked<FavoritesService>;
  let snackBar: { open: jest.Mock };
  let loggerService: jest.Mocked<LoggerService>;

  const mockFact: IFactResponse = {
    id: '1',
    text: 'Test fact',
    source: 'Test source',
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    factsApiService = {
      getRandomFact: jest.fn(),
      searchFacts: jest.fn(),
    } as unknown as jest.Mocked<FactsApiService>;

    favoritesService = {
      add: jest.fn(),
      remove: jest.fn(),
      getAll: jest.fn(),
      isFavorite: jest.fn(),
    } as unknown as jest.Mocked<FavoritesService>;

    snackBar = { open: jest.fn() };

    loggerService = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    await TestBed.configureTestingModule({
      imports: [RandomFactComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: FactsApiService, useValue: factsApiService },
        { provide: FavoritesService, useValue: favoritesService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: LoggerService, useValue: loggerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomFactComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load random fact on init', fakeAsync(() => {
    factsApiService.getRandomFact.mockReturnValue(of(mockFact));
    fixture.detectChanges();
    tick();
    expect(component.currentFact).toEqual(mockFact);
    expect(component.isLoading).toBeFalsy();
  }));

  it('should handle error when loading random fact', fakeAsync(() => {
    const errorMessage = 'Test error';
    factsApiService.getRandomFact.mockReturnValue(throwError(() => new Error(errorMessage)));
    fixture.detectChanges();
    tick();
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('Failed to load random fact');
    expect(loggerService.error).toHaveBeenCalledWith(
      'Error loading random fact',
      expect.any(Error),
      'RandomFactComponent',
    );
  }));

  it('should get new fact when getNewFact is called', fakeAsync(() => {
    factsApiService.getRandomFact.mockReturnValue(of(mockFact));
    component.getNewFact();
    tick();
    expect(component.currentFact).toEqual(mockFact);
    expect(component.isLoading).toBeFalsy();
  }));

  it('should check if fact is favorite', () => {
    component.currentFact = mockFact;
    favoritesService.isFavorite.mockReturnValue(true);
    expect(component.isFavorite()).toBeTruthy();
  });

  it('should add fact to favorites', () => {
    component.currentFact = mockFact;
    component.saveToFavorites();
    expect(favoritesService.add).toHaveBeenCalledWith(mockFact);
  });

  it('should remove fact from favorites', () => {
    component.currentFact = mockFact;
    component.removeFromFavorites();
    expect(favoritesService.remove).toHaveBeenCalledWith(mockFact);
  });

  it('should not add to favorites if no current fact', () => {
    component.currentFact = null;
    component.saveToFavorites();
    expect(favoritesService.add).not.toHaveBeenCalled();
  });

  it('should not remove from favorites if no current fact', () => {
    component.currentFact = null;
    component.removeFromFavorites();
    expect(favoritesService.remove).not.toHaveBeenCalled();
  });

  it('should show loading state while fetching fact', fakeAsync(() => {
    factsApiService.getRandomFact.mockReturnValue(timer(100).pipe(map(() => mockFact)));
    component.getNewFact();
    expect(component.isLoading).toBeTruthy();
    tick(100);
    expect(component.isLoading).toBeFalsy();
  }));
});
