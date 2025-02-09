import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'pokemon-list',
    loadComponent: () =>
      import('./pages/pokemon-list/pokemon-list.component').then(
        (c) => c.PokemonListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'favorite-pokemons',
    loadComponent: () =>
      import('./pages/favorite-pokemons/favorite-pokemons.component').then(
        (c) => c.FavoritePokemonsComponent
      ),
    canActivate: [AuthGuard],
  },
];
