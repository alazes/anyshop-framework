import { Injectable, Optional } from '@angular/core';

export interface IComponentsModuleConfig {
  /**
   * API key para Google Map.
   */
  googleMapsApiKey?: string;

  /**
   * URL base para Static Map API.
   */
  googleMapsStaticUrl?: string;

  /**
   * Default currency code for all components.
   */
  defaultCurrency?: 'USD' | 'PEN' | string; // TODO: Ampliar
}

export class ComponentsModuleConfig implements Required<IComponentsModuleConfig> {
  googleMapsApiKey: string;
  googleMapsStaticUrl: string;
  defaultCurrency: 'USD' | 'PEN' | string;

  constructor(info: IComponentsModuleConfig = {}) {
    this.googleMapsApiKey = info.googleMapsApiKey ?? '';

    this.googleMapsStaticUrl = info.googleMapsStaticUrl || 'https://maps.googleapis.com/maps/api/staticmap';

    this.defaultCurrency = info.defaultCurrency || 'PEN';
  }
}

@Injectable({
  providedIn: 'root',
})
export class ComponentsConfigService {
  private readonly _config: ComponentsModuleConfig;

  protected get config() {
    return this._config;
  }

  get googleMapsApiKey() {
    return this.config.googleMapsApiKey;
  }

  get defaultCurrency() {
    return this.config.defaultCurrency;
  }

  get staticMapBaseUrl() {
    return this.config.googleMapsStaticUrl;
  }

  constructor(@Optional() configuration: ComponentsModuleConfig) {
    if (configuration) {
      this._config = configuration;
    } else {
      this._config = new ComponentsModuleConfig();
    }
  }
}
