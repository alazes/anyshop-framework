import { Component, Input, OnInit } from '@angular/core';
import { includes, replace, trim, truncate, upperCase } from 'lodash';

// TODO: Mover interfaces a @pidelo/contracts

/*
  Maps Static API
  https://developers.google.com/maps/documentation/maps-static/dev-guide
 */

export interface IStaticMapParams {
  key: string;
  center?: string;
  zoom?: number;
  size?: string;
  scale?: number;
  format?: 'png8' | 'png32' | 'gif' | 'jpg' | 'jpg-baseline';
  markers: string[];
  path?: string;
}

export interface IStaticMapMarkers {
  style?: IMapMarkerStyle;
  items: IMapMarker[];
}

export interface IMapMarker {
  location: IMapLocation;
  style: IMapMarkerStyle;
  scale?: 1 | 2 | 4 | number;
}

export interface IMapMarkerStyle {
  size?: 'tiny' | 'mid' | 'small';
  color?:
    | 'black'
    | 'brown'
    | 'green'
    | 'purple'
    | 'yellow'
    | 'blue'
    | 'gray'
    | 'orange'
    | 'red'
    | 'white'
    | string;
  label?: string;
}

export interface IMapLocation {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss'],
})
export class MapMarkerComponent implements OnInit {
  private _marker: IMapMarker = {
    location: {
      latitude: 0,
      longitude: 0,
    },
    scale: 1,
    style: {},
  };

  public get data() {
    return this._marker;
  }

  @Input()
  set location(value) {
    this.latitude = value.latitude;
    this.longitude = value.longitude;
  }
  get location() {
    return this.data.location;
  }

  @Input()
  public set latitude(value: string | number) {
    this.data.location.latitude = +value;
  }

  @Input()
  public set longitude(value: string | number) {
    this.data.location.longitude = +value;
  }

  @Input()
  set scale(value) {
    if (includes([1, 2, 4], +value)) {
      this.data.scale = +value;
    } else {
      console.warn(
        'Invalid value for scale (expected 1, 2 or 4). Ignoring.',
        value
      );
    }
  }
  get scale() {
    return this.data.scale || 1;
  }

  @Input()
  set label(value) {
    let char = trim(upperCase(value));

    if (!char) {
      this.data.style.label = undefined;

      return;
    }

    if (char.length > 1) {
      char = truncate(char, { length: 1, omission: '' });
      console.warn(
        'Invalid value for label (1 character length expected). Truncated.',
        value,
        char
      );
    }

    this.data.style.label = char;
  }
  get label() {
    return this.data.style.label;
  }

  @Input()
  set color(value) {
    this.data.style.color = value;
  }
  get color() {
    return this.data.style.color;
  }

  @Input()
  set size(value) {
    this.data.style.size = value;
  }
  get size() {
    return this.data.style.size;
  }

  constructor() {}

  ngOnInit() {
    if (!this.data.location.latitude) {
      console.error('`latitude` prop is not set.');
    }

    if (!this.data.location.longitude) {
      console.error('`longitude` prop is not set.');
    }
  }

  public toUrlString(): string {
    let q = '';

    if (this.color) {
      q += 'color:{color}|';
    }
    if (this.label) {
      q += 'label:{label}|';
    }
    if (this.scale) {
      q += 'scale:{scale}|';
    }
    if (this.size) {
      q += 'size:{size}|';
    }

    q += `${this.data.location.latitude},${this.data.location.longitude}`;

    q = replace(q, new RegExp('{color}', 'g'), `${this.color}`);
    q = replace(q, new RegExp('{label}', 'g'), `${this.label}`);
    q = replace(q, new RegExp('{scale}', 'g'), `${this.scale}`);
    q = replace(q, new RegExp('{size}', 'g'), `${this.size}`);
    q = replace(q, /#/g, '%23');
    q = replace(q, /\|/g, '%7C');

    return q;
  }
}
