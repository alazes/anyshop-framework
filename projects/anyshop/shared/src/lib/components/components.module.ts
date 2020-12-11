import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { ComponentsModuleConfig } from '../components-config.service';

import { AppLoadingComponent } from './app-loading/app-loading.component';
import { BusinessCardComponent } from './business-card/business-card.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { DesplegableCardComponent } from './desplegable-card/desplegable-card.component';
import { ElapsedTimeWidgetComponent } from './elapsed-time-widget/elapsed-time-widget.component';
import { FaRatingComponent } from './fa-rating/fa-rating.component';
import { FullOrderStatusWidgetComponent } from './full-order-status-widget/full-order-status-widget.component';
import { MapMarkerComponent } from './map-marker/map-marker.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderProductCardComponent } from './order-product-card/order-product-card.component';
import { PaymentMethodIconComponent } from './payment-method-icon/payment-method-icon.component';
import { PaymentMethodPopoverComponent } from './payment-method-popover/payment-method-popover.component';
import { PaymentMethodWidgetComponent } from './payment-method-widget/payment-method-widget.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import {
  CustomValidators,
  ProductOptionFormGroup,
  ProductOptionValueFormGroup,
} from './product-modal/product-option.form-group';
import { ProductStockCardComponent } from './product-stock-card/product-stock-card.component';
import { RateIconComponent } from './rate-icon/rate-icon.component';
import { StaticMapImageComponent } from './static-map-image/static-map-image.component';

const all = [
  BusinessCardComponent,
  CategoryCardComponent,
  DesplegableCardComponent,
  ElapsedTimeWidgetComponent,
  ElapsedTimeWidgetComponent,
  FullOrderStatusWidgetComponent,
  MapMarkerComponent,
  PaymentMethodIconComponent,
  PaymentMethodPopoverComponent,
  PaymentMethodWidgetComponent,
  ProductStockCardComponent,
  RateIconComponent,
  StaticMapImageComponent,
  FaRatingComponent,
  OrderCardComponent,
  AppLoadingComponent,
  OrderProductCardComponent,
  ProductModalComponent,
];

@NgModule({
  declarations: all,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RoundProgressModule,
    RouterModule,
    TranslateModule.forChild(),
    NgxIonicImageViewerModule,
  ],
  exports: all,
})
export class ComponentsModule {
  static forRoot(
    config?: ComponentsModuleConfig
  ): ModuleWithProviders<ComponentsModule> {
    return {
      ngModule: ComponentsModule,
      providers: [
        {
          provide: ComponentsModuleConfig,
          useValue: config,
        },
      ],
    };
  }
}

export {
  AppLoadingComponent,
  OrderCardComponent,
  OrderProductCardComponent,
  ComponentsModule as PideloComponentsModule,
  BusinessCardComponent,
  CategoryCardComponent,
  DesplegableCardComponent,
  ElapsedTimeWidgetComponent,
  FullOrderStatusWidgetComponent,
  MapMarkerComponent,
  PaymentMethodIconComponent,
  PaymentMethodPopoverComponent,
  PaymentMethodWidgetComponent,
  ProductStockCardComponent,
  RateIconComponent,
  StaticMapImageComponent,
  FaRatingComponent,
  ProductModalComponent,
  //
  ProductOptionFormGroup,
  ProductOptionValueFormGroup,
  CustomValidators,
};
