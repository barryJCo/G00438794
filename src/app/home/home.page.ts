import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { SpoonacularService, ComplexSearchResult } from '../core/services/spoonacular.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  studentNumber = 'G00438794';

  query = '';
  results: ComplexSearchResult[] = [];

  loading = false;
  searched = false;
  error = '';

  constructor(private spoonacular: SpoonacularService) {}

  search(): void {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;
    this.searched = true;
    this.error = '';
    this.results = [];

    this.spoonacular.searchRecipesByIngredients(q).subscribe({
      next: (res) => {
        this.results = res?.results ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load recipes. Check internet connection / API key.';
        this.loading = false;
      },
    });
  }
}

