import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FavoritesService } from './services/favorites.service';
import { FactsApiService } from './services/facts-api.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FavoritesService, FactsApiService],
})
export class CoreModule {}
