import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { head, includes, reverse, tail, toPlainObject } from 'lodash';
import { startWith } from 'rxjs/operators';

import { ComponentsConfigService } from '../../components-config.service';
import { normalizeBooleanAttribute, objectToQueryString } from '../../helpers';
import {
  IStaticMapParams,
  MapMarkerComponent,
} from '../map-marker/map-marker.component';

@Component({
  selector: 'static-map-image',
  templateUrl: './static-map-image.component.html',
  styleUrls: ['./static-map-image.component.scss'],
})
export class StaticMapImageComponent implements OnInit, AfterContentInit {
  private _src = '';
  private _drawPath = false;
  private _clickable = false;

  private _queryParams: IStaticMapParams = {
    key: '',
    size: '200x200',
    markers: [],
  };

  protected readonly baseUrl: string;

  public _asdasd = 4;
  mapLink: string | undefined;

  protected get queryParams() {
    return this._queryParams;
  }

  get src(): string {
    return this._src;
  }

  @ContentChildren(MapMarkerComponent)
  markers!: QueryList<MapMarkerComponent>;

  @Input()
  set zoom(value) {
    this.queryParams.zoom = value;
  }
  get zoom() {
    return this.queryParams.zoom;
  }

  @Input()
  set size(value) {
    this.queryParams.size = value;
  }
  get size() {
    return this.queryParams.size;
  }

  @Input()
  set scale(value) {
    if (includes([1, 2, 4], +value)) {
      this.queryParams.scale = +value;
    } else {
      console.warn(
        'Invalid value for scale (expected 1, 2 or 4). Ignoring.',
        value
      );
    }
  }
  get scale() {
    return this.queryParams.scale || 1;
  }

  @Input()
  set drawPath(value) {
    this._drawPath = normalizeBooleanAttribute(value);
  }

  get drawPath() {
    return this._drawPath;
  }

  @Input()
  set clickable(value) {
    this._clickable = normalizeBooleanAttribute(value);
  }

  get clickable() {
    return this._clickable;
  }

  constructor(config: ComponentsConfigService) {
    this.queryParams.key = config.googleMapsApiKey;
    this.baseUrl = config.staticMapBaseUrl;

    if (!this.queryParams.key) {
      console.error(
        'Error: No se ha especificado la key de Google Maps Static API. No se podrá usar este componente.' +
          'Use `PideloComponentsModule.forRoot(config)` al importar en el módulo principal de la aplicación.'
      );
    }
  }

  ngOnInit() {
    this.updateSrc();
  }

  ngAfterContentInit() {
    this.markers.changes
      .pipe(startWith(this.markers))
      .subscribe((markers: Array<MapMarkerComponent>) => {
        let paths: string[] = [];

        this.queryParams.markers = markers.map((marker) => {
          paths.push(
            `${marker.location.latitude},${marker.location.longitude}`
          );

          return marker.toUrlString();
        });

        if (paths.length > 0) {
          if (this.drawPath) {
            this.queryParams.path = paths.join('%7C');
          }

          paths = reverse(paths);

          const lastCoords = head(paths);
          this.mapLink = `https://www.google.com/maps/dir/?api=1&destination=${lastCoords}`;

          if (paths.length > 1) {
            const waypointsCoors = tail(paths).join('%7C');

            this.mapLink += `&waypoints=${waypointsCoors}`;
            // console.log({ waypointsCoors });
          }

          console.log({ lastCoords });
        } else {
          this.queryParams.path = undefined;
          this.mapLink = undefined;
        }

        this.updateSrc();
      });
  }

  updateSrc() {
    const queryParamsString = objectToQueryString(
      toPlainObject(this.queryParams)
    );

    // console.log('urlQueries', this.queryParams);

    this._src = this.baseUrl + '?' + queryParamsString;

    // console.log(this.src);
  }

  openMap() {
    if (this.clickable && this.mapLink) {
      // console.log(this.mapLink);
      window.open(this.mapLink, '_system');
    }
  }
}
