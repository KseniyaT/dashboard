import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../../core/services/favorites.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { FactCardComponent } from '../../../shared/components/fact-card/fact-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { IFactResponse } from '../../../core/models/fact-response.interface';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from '../../../core/services/logger.service';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesServiceMock: jest.Mocked<FavoritesService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let loggerServiceMock: jest.Mocked<LoggerService>;

  const mockFavorites: IFactResponse[] = [
    {
      id: '1',
      text: 'Test fact 1',
      source: 'Test source 1',
      createdAt: '2025-05-13T17:49:20.699Z',
    },
    {
      id: '2',
      text: 'Test fact 2',
      source: 'Test source 2',
      createdAt: '2025-05-13T17:49:20.698Z',
    },
  ];

  beforeEach(async () => {
    favoritesServiceMock = {
      getAll: jest.fn().mockReturnValue(of(mockFavorites)),
      remove: jest.fn(),
      add: jest.fn(),
    } as any;

    snackBarMock = {
      open: jest.fn(),
    } as any;

    loggerServiceMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        FavoritesComponent,
        SearchComponent,
        FactCardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: LoggerService, useValue: loggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    (component as any).snackBar = snackBarMock;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites on init', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.allFavorites).toEqual(mockFavorites);
  });

  it('should display favorites list', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const factCards = fixture.debugElement.queryAll(By.directive(FactCardComponent));
    expect(factCards.length).toBe(mockFavorites.length);
  });

  it('should filter favorites on search', async () => {
    const searchText = 'Test fact 1';
    component.onSearch(searchText);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(1);
    expect(component.displayedFavorites[0].text).toBe(searchText);
  });

  it('should show all favorites when search is empty', async () => {
    component.onSearch('');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(mockFavorites.length);
  });

  it('should filter to single item when item is selected', async () => {
    const selectedItem = mockFavorites[0];
    component.onItemSelected(selectedItem);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(1);
    expect(component.displayedFavorites[0]).toBe(selectedItem);
  });

  it('should remove fact from favorites', async () => {
    const fact = {
      id: '1',
      text: 'Test fact',
      type: 'trivia',
      createdAt: new Date().toISOString(),
    };
    component.allFavorites = [fact];
    component.displayedFavorites = [fact];
    fixture.detectChanges();

    component.removeFromFavorites(fact);
    fixture.detectChanges();

    expect(favoritesServiceMock.remove).toHaveBeenCalledWith(fact);
    expect(snackBarMock.open).toHaveBeenCalledWith('Fact removed from favorites', 'Close', {
      duration: 3000,
    });
  });

  it('should show empty state if no favorites', async () => {
    favoritesServiceMock.getAll.mockReturnValue(of([]));
    component.loadFavorites();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(0);
  });

  it('should filter favorites by search (no match)', async () => {
    component.onSearch('nonexistent');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(0);
  });

  it('should filter favorites by search (match)', async () => {
    component.onSearch('Test fact 1');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(1);
    expect(component.displayedFavorites[0].text).toBe('Test fact 1');
  });

  it('should select item from search', async () => {
    const selectedItem = mockFavorites[0];
    component.onItemSelected(selectedItem);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(1);
    expect(component.displayedFavorites[0]).toBe(selectedItem);
  });

  it('should reset search', async () => {
    component.onSearch('test');
    await fixture.whenStable();
    fixture.detectChanges();
    component.onSearch('');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.displayedFavorites.length).toBe(mockFavorites.length);
  });

  it('should not load more favorites if already loading', async () => {
    const initialLength = component.displayedFavorites.length;
    component.isLoading = true;
    component.onScroll();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.displayedFavorites.length).toBe(initialLength);
  });

  it('should load more favorites when scrolled to bottom', async () => {
    const initialLength = component.displayedFavorites.length;
    component.isLoading = false;
    component.allFavorites = [...mockFavorites, ...mockFavorites];
    component.displayedFavorites = [...mockFavorites];
    component.onScroll();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.displayedFavorites.length).toBeGreaterThan(initialLength);
  });

  it('should sort favorites by createdAt in descending order', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const sortedFavorites = [...mockFavorites].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    expect(component.allFavorites).toEqual(sortedFavorites);
  });

  it('should handle error when loading favorites', async () => {
    const error = new Error('Failed to load favorites');
    favoritesServiceMock.getAll.mockReturnValue(throwError(() => error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.loadFavorites();
    fixture.detectChanges();
    expect(snackBarMock.open).toHaveBeenCalledWith('Error loading favorites', 'Close', {
      duration: 3000,
    });
    consoleErrorSpy.mockRestore();
  });
});
