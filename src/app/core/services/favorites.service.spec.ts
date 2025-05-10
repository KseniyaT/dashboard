import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { IFactResponse } from '../models/fact-response.interface';
import { firstValueFrom } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from './logger.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let loggerServiceMock: jest.Mocked<LoggerService>;
  let consoleErrorSpy: jest.SpyInstance;

  const mockFacts: IFactResponse[] = [
    { id: '1', text: 'Test fact 1', createdAt: '2024-01-01' },
    { id: '2', text: 'Test fact 2', createdAt: '2024-01-02' },
  ];

  beforeEach(() => {
    loggerServiceMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as any;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LoggerService, useValue: loggerServiceMock }],
    });
    service = TestBed.inject(FavoritesService);
    localStorage.clear();
    // Clear any existing favorites from the service
    service['favorites'].next([]);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add fact to favorites', async () => {
    service.add(mockFacts[0]);
    const favorites = await firstValueFrom(service.getAll());
    expect(favorites.length).toBe(1);
    expect(favorites[0].id).toBe(mockFacts[0].id);
    expect(favorites[0].text).toBe(mockFacts[0].text);
    expect(favorites[0].createdAt).toBeDefined();
  });

  it('should remove fact from favorites', async () => {
    service.add(mockFacts[0]);
    service.add(mockFacts[1]);
    service.remove(mockFacts[0]);
    const favorites = await firstValueFrom(service.getAll());
    expect(favorites.length).toBe(1);
    expect(favorites[0].id).toBe(mockFacts[1].id);
    expect(favorites[0].text).toBe(mockFacts[1].text);
    expect(favorites[0].createdAt).toBeDefined();
  });

  it('should check if fact is in favorites', () => {
    service.add(mockFacts[0]);
    expect(service.isFavorite('1')).toBe(true);
    expect(service.isFavorite('2')).toBe(false);

    service.add(mockFacts[1]);
    expect(service.isFavorite('2')).toBe(true);
  });

  it('should get all favorites sorted by createdAt in descending order', async () => {
    // Add facts in reverse order to test sorting
    service.add(mockFacts[1]); // 2024-01-02
    service.add(mockFacts[0]); // 2024-01-01

    const favorites = await firstValueFrom(service.getAll());
    expect(favorites).toHaveLength(mockFacts.length);

    // Verify that facts are sorted by createdAt in descending order
    expect(favorites[0].id).toBe(mockFacts[1].id); // Should be 2024-01-02 first
    expect(favorites[1].id).toBe(mockFacts[0].id); // Should be 2024-01-01 second

    // Verify other properties
    favorites.forEach(favorite => {
      const mockFact = mockFacts.find(f => f.id === favorite.id);
      expect(mockFact).toBeDefined();
      expect(favorite.text).toBe(mockFact?.text);
      expect(favorite.createdAt).toBeDefined();
    });
  });

  it('should persist favorites in localStorage', () => {
    service.add(mockFacts[0]);
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedFavorites.length).toBe(1);
    expect(storedFavorites[0].id).toBe(mockFacts[0].id);
    expect(storedFavorites[0].text).toBe(mockFacts[0].text);
    expect(storedFavorites[0].createdAt).toBeDefined();
  });

  it('should load favorites from localStorage on init', async () => {
    const newService = TestBed.inject(FavoritesService);
    const factWithTimestamp = {
      ...mockFacts[0],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('favorites', JSON.stringify([factWithTimestamp]));
    newService['loadFavorites']();
    const favorites = await firstValueFrom(newService.getAll());
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(mockFacts[0].id);
    expect(favorites[0].text).toBe(mockFacts[0].text);
    expect(favorites[0].createdAt).toBeDefined();
  });

  it('should handle parse error in loadFavorites', () => {
    localStorage.setItem('favorites', 'not-a-json');
    (service as any).loadFavorites();
    expect(service['favorites'].value).toEqual([]);
    expect(loggerServiceMock.error).toHaveBeenCalledWith(
      'Error parsing stored favorites',
      expect.any(Error),
      'FavoritesService',
    );
  });

  it('should handle error in saveFavorites', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('save error');
    };
    expect(() => service.add(mockFacts[0])).not.toThrow();
    expect(loggerServiceMock.error).toHaveBeenCalledWith(
      'Error saving favorites',
      expect.any(Error),
      'FavoritesService',
    );
    localStorage.setItem = originalSetItem;
  });

  it('should handle localStorage being unavailable', () => {
    const originalGetItem = localStorage.getItem;
    const originalSetItem = localStorage.setItem;
    localStorage.getItem = () => null;
    localStorage.setItem = () => {};

    const newService = TestBed.inject(FavoritesService);
    newService['loadFavorites']();
    expect(newService['favorites'].value).toEqual([]);

    localStorage.getItem = originalGetItem;
    localStorage.setItem = originalSetItem;
  });

  it('should not add duplicate fact', async () => {
    service.add(mockFacts[0]);
    service.add(mockFacts[0]);
    const favorites = await firstValueFrom(service.getAll());
    expect(favorites.filter(f => f.id === mockFacts[0].id)).toHaveLength(1);
  });

  it('should not throw when removing non-existent fact', async () => {
    const mockFacts = [
      {
        id: '1',
        text: 'Test fact 1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Test fact 2',
        createdAt: new Date().toISOString(),
      },
    ];

    service.add(mockFacts[0]);
    expect(() => service.remove(mockFacts[1])).not.toThrow();
    const favorites = await firstValueFrom(service.getAll());
    expect(favorites).toContainEqual(expect.objectContaining({ id: '1', text: 'Test fact 1' }));
    expect(favorites).not.toContainEqual(expect.objectContaining({ id: '2', text: 'Test fact 2' }));
  });

  it('should return false for isFavorite with non-existent id', () => {
    expect(service.isFavorite('not-exist')).toBe(false);
  });
});
