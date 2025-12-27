import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SettingsService, Units } from '../../core/services/settings.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Settings</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-list>
    <ion-list-header>
      <ion-label>Measurement</ion-label>
    </ion-list-header>

    <ion-radio-group [(ngModel)]="units" (ionChange)="save()">
      <ion-item>
        <ion-label>Metric</ion-label>
        <ion-radio slot="start" value="metric"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>US</ion-label>
        <ion-radio slot="start" value="us"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
</ion-content>
  `,
})
export class SettingsPage {
  units: Units = 'metric';

  constructor(private settings: SettingsService) {}

  ionViewWillEnter(): void {
    // Loads saved value; defaults to metric if none saved
    this.units = this.settings.getUnits();
  }

  save(): void {
    this.settings.setUnits(this.units);
  }
}
