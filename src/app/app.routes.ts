import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'favourites',
    loadComponent: () => import('./pages/favourites/favourites.page').then((m) => m.FavouritesPage),
  },
  // To add later:
  // {
  //   path: 'recipe/:id',
  //   loadComponent: () => import('./pages/recipe-details/recipe-details.page').then((m) => m.RecipeDetailsPage),
  // },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
