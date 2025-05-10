import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/random-fact/random-fact.module').then(m => m.RandomFactModule),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/favorites/favorites.module').then(m => m.FavoritesModule),
  },
  {
    path: '404',
    loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule),
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
