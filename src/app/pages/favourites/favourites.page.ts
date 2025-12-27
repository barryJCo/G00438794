import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FavouritesService, FavouriteRecipe } from '../../core/services/favourites.service';

@Component({
  standalone: true,
  selector: 'app-favourites',
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Favourites</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-list *ngIf="favs.length > 0">
    <ion-item *ngFor="let r of favs">
      <ion-thumbnail slot="start">
        <img [src]="r.image" [alt]="r.title" />
      </ion-thumbnail>

      <ion-label>
        <h2>{{ r.title }}</h2>
      </ion-label>

      <ion-button slot="end" [routerLink]="['/recipe', r.id]">
        Details
      </ion-button>

      <ion-button slot="end" color="danger" (click)="remove(r.id)">
        Remove
      </ion-button>
    </ion-item>
  </ion-list>

  <ion-text *ngIf="favs.length === 0">
    <p>No favourites yet.</p>
  </ion-text>
</ion-content>
  `,
})
export class FavouritesPage {
  favs: FavouriteRecipe[] = [];

  constructor(private favourites: FavouritesService) {}

  ionViewWillEnter(): void {
    this.favs = this.favourites.getAll();
  }

  remove(id: number): void {
    this.favourites.remove(id);
    this.favs = this.favourites.getAll();
  }
}
