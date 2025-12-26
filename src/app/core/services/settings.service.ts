import { Injectable } from '@angular/core';

export type Units = 'metric' | 'us';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly key = 'unitPreference';

  getUnits(): Units {
    const saved = localStorage.getItem(this.key);
    return saved === 'us' ? 'us' : 'metric'; // default metric
  }

  setUnits(units: Units): void {
    localStorage.setItem(this.key, units);
  }
}