import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface ComplexSearchResult {
  id: number;
  title: string;
  image: string;
}

export interface ComplexSearchResponse {
  results: ComplexSearchResult[];
}

export interface RecipeInformationResponse {
  id: number;
  image: string;
  extendedIngredients: Array<{
    original: string;
    measures: {
      us: { amount: number; unitLong: string };
      metric: { amount: number; unitLong: string };
    };
  }>;
  analyzedInstructions: Array<{
    steps: Array<{ number: number; step: string }>;
  }>;
}

@Injectable({ providedIn: 'root' })
export class SpoonacularService {
  private baseUrl = environment.spoonacularBaseUrl;
  private apiKey = environment.spoonacularApiKey;

  constructor(private http: HttpClient) {}

  searchRecipesByIngredients(query: string): Observable<ComplexSearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('apiKey', this.apiKey);

    return this.http.get<ComplexSearchResponse>(`${this.baseUrl}/recipes/complexSearch`, { params });
  }

  getRecipeInformation(id: number): Observable<RecipeInformationResponse> {
    const params = new HttpParams().set('apiKey', this.apiKey);
    return this.http.get<RecipeInformationResponse>(`${this.baseUrl}/recipes/${id}/information`, { params });
  }
}