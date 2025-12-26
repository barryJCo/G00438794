import { Injectable } from '@angular/core';

export interface FavouriteRecipe {
  id: number;
  title: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private readonly key = 'favouriteRecipes';

  getAll(): FavouriteRecipe[] {
    const raw = localStorage.getItem(this.key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as FavouriteRecipe[];
    } catch {
      return [];
    }
  }

  isFavourite(id: number): boolean {
    return this.getAll().some(r => r.id === id);
  }

  add(recipe: FavouriteRecipe): void {
    const list = this.getAll();
    if (list.some(r => r.id === recipe.id)) return;
    list.push(recipe);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  remove(id: number): void {
    const list = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }
}