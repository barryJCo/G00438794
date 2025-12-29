import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  SpoonacularService,
  RecipeInformationResponse,
} from '../../core/services/spoonacular.service';
import { SettingsService, Units } from '../../core/services/settings.service';
import {
  FavouritesService,
  FavouriteRecipe,
} from '../../core/services/favourites.service';

@Component({
  standalone: true,
  selector: 'app-recipe-details',
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Recipe Details</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-spinner *ngIf="loading" class="ion-margin-top"></ion-spinner>

  <ion-text color="danger" *ngIf="error">
    <p>{{ error }}</p>
  </ion-text>

  <div *ngIf="!loading && recipe">
    <img
      [src]="recipe.image"
      [alt]="recipe.title || 'recipe image'"
      style="width: 100%; border-radius: 12px; margin-bottom: 12px;"
    />

    <h2 style="margin-top: 0;">{{ recipe.title }}</h2>

    <ion-list>
      <ion-list-header>
        <ion-label>Ingredients ({{ units.toUpperCase() }})</ion-label>
      </ion-list-header>

      <ion-item *ngFor="let ing of recipe.extendedIngredients">
        <ion-label>
          <div>
            <strong>{{ formatAmount(ing.measures) }}</strong>
            {{ formatUnit(ing.measures) }}
            — {{ ing.original }}
          </div>
        </ion-label>
      </ion-item>
    </ion-list>

    <ion-list class="ion-margin-top">
      <ion-list-header>
        <ion-label>Instructions</ion-label>
      </ion-list-header>

      <ion-item *ngFor="let s of steps">
        <ion-label>
          <strong>{{ s.number }}.</strong> {{ s.step }}
        </ion-label>
      </ion-item>

      <ion-item *ngIf="steps.length === 0">
        <ion-label>No instructions available.</ion-label>
      </ion-item>
    </ion-list>

    <ion-button expand="block" class="ion-margin-top" (click)="toggleFavourite()">
      {{ isFavourite ? 'Remove From Favourites' : 'Add to Favourites' }}
    </ion-button>
  </div>
</ion-content>
  `,
})
export class RecipeDetailsPage {
  recipeId = 0;

  recipe: RecipeInformationResponse | null = null;
  steps: Array<{ number: number; step: string }> = [];

  units: Units = 'metric';
  isFavourite = false;

  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: SpoonacularService,
    private settings: SettingsService,
    private favourites: FavouritesService
  ) {}

  ngOnInit(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ionViewWillEnter(): void {
    // refresh units each time you enter (so Settings changes apply)
    this.units = this.settings.getUnits();
    this.loadRecipe();
  }

  private loadRecipe(): void {
    this.loading = true;
    this.error = '';
    this.recipe = null;
    this.steps = [];

    if (!Number.isFinite(this.recipeId) || this.recipeId <= 0) {
      this.error = 'Invalid recipe ID.';
      this.loading = false;
      return;
    }

    this.api.getRecipeInformation(this.recipeId).subscribe({
      next: (res) => {
        this.recipe = res;
        this.steps = res.analyzedInstructions?.[0]?.steps ?? [];
        this.isFavourite = this.favourites.isFavourite(res.id);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load recipe details.';
        this.loading = false;
      },
    });
  }

  toggleFavourite(): void {
    if (!this.recipe) return;

    const fav: FavouriteRecipe = {
      id: this.recipe.id,
      title: this.recipe.title ?? 'Recipe',
      image: this.recipe.image ?? '',
    };

    if (this.isFavourite) {
      this.favourites.remove(this.recipe.id);
      this.isFavourite = false;
    } else {
      this.favourites.add(fav);
      this.isFavourite = true;
    }
  }

  formatAmount(measures: any): string {
    const amount =
      this.units === 'us' ? measures.us.amount : measures.metric.amount;

    // Make amounts look nicer (e.g., 1.5 not 1.500000)
    const rounded = Math.round(amount * 100) / 100;
    return Number.isFinite(rounded) ? String(rounded) : '';
  }

  formatUnit(measures: any): string {
    const unit =
      this.units === 'us' ? measures.us.unitLong : measures.metric.unitLong;

    return unit ?? '';
  }
}
