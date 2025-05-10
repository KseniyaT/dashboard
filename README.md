# Dashboard App

## Overview
Dashboard App is an Angular application that allows users to browse, search, and manage interesting facts. The application features a modern UI with Material Design components and provides a seamless user experience for managing favorite facts.

**How it works:**
- **Main Page:**
  - View a random fact as soon as you open the app.
  - Click the "New Fact" button to get another random fact instantly.
  - Add the current fact to your favorites by clicking the star icon; remove it from favorites the same way.
- **Favorites Page:**
  - View all your saved favorite facts.
  - Remove facts from favorites directly from the list.
  - Sort your favorites by date.
  - Use the search bar to quickly find a fact among your favorites.
- **Navigation:**
  - Use the header navigation to switch between the main page and your favorites.
  - All favorites are stored locally in your browser, so they persist between sessions.

## Features
- Browse random facts
- Search facts by keywords
- Add/remove facts to favorites
- Sort favorites by date
- Responsive design
- Accessibility support

## Getting Started

### Prerequisites
- Node.js (v20)
- npm (v10)
- Angular CLI (v18)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd dashboard-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Service Usage

### FavoritesService
The `FavoritesService` provides functionality to manage favorite facts. It uses local storage to persist data and provides reactive updates through RxJS.

#### Basic Usage
```typescript
import { FavoritesService } from '@core/services/favorites.service';
import { IFactResponse } from '@core/models/fact-response.interface';

@Component({
  // ... component metadata
})
export class YourComponent {
  constructor(private favoritesService: FavoritesService) {}

  // Get all favorites
  getAllFavorites(): void {
    this.favoritesService.getAll().subscribe(favorites => {
      console.log('Favorites:', favorites);
    });
  }

  // Add a fact to favorites
  addToFavorites(fact: IFactResponse): void {
    this.favoritesService.add(fact);
  }

  // Remove a fact from favorites
  removeFromFavorites(fact: IFactResponse): void {
    this.favoritesService.remove(fact);
  }

  // Check if a fact is in favorites
  isInFavorites(factId: string): boolean {
    return this.favoritesService.isFavorite(factId);
  }
}
```

### FactsApiService
The `FactsApiService` provides methods to interact with the facts API.

#### Basic Usage
```typescript
import { FactsApiService } from '@core/services/facts-api.service';
import { IFactResponse } from '@core/models/fact-response.interface';

@Component({
  // ... component metadata
})
export class YourComponent {
  constructor(private factsApiService: FactsApiService) {}

  // Get a random fact
  getRandomFact(): void {
    this.factsApiService.getRandomFact().subscribe(
      fact => {
        console.log('Random fact:', fact);
      },
      error => {
        console.error('Error fetching fact:', error);
      }
    );
  }

  // Search facts
  searchFacts(query: string): void {
    this.factsApiService.searchFacts(query).subscribe(
      facts => {
        console.log('Search results:', facts);
      },
      error => {
        console.error('Error searching facts:', error);
      }
    );
  }
}
```

### LoggerService
The `LoggerService` provides centralized logging functionality with different log levels.

#### Basic Usage
```typescript
import { LoggerService } from '@core/services/logger.service';
import { LogLevel } from '@core/services/logger.service';

@Component({
  // ... component metadata
})
export class YourComponent {
  constructor(private logger: LoggerService) {}

  logExample(): void {
    // Log with different levels
    this.logger.debug('Debug message', { data: 'some data' }, 'ComponentName');
    this.logger.info('Info message', { data: 'some data' }, 'ComponentName');
    this.logger.warn('Warning message', { data: 'some data' }, 'ComponentName');
    this.logger.error('Error message', new Error('Something went wrong'), 'ComponentName');
  }
}
```

## Constants

The application uses several constant files to maintain consistency:

### UI Constants
Located in `src/app/core/constants/ui.constants.ts`:
```typescript
export const SNACKBAR_DURATION = 3000;
export const LOADING_SPINNER_DIAMETER = 40;
export const SCROLL_THRESHOLD = 200;
export const ITEMS_PER_PAGE = 10;
```

### Storage Constants
Located in `src/app/core/constants/storage.constants.ts`:
```typescript
export const FAVORITES_STORAGE_KEY = 'favorites';
```

### API Constants
Located in `src/app/core/constants/api.constants.ts`:
```typescript
export const FACTS_URL = 'https://uselessfacts.jsph.pl/api/v2/facts';
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

