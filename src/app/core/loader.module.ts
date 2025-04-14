import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'aliceblue',
  bgsOpacity: 1,
  bgsPosition: 'bottom-right',
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise',
  blur: 10,
  delay: 0,
  fastFadeOut: true,
  fgsColor: 'aliceblue',
  fgsPosition: 'center-center',
  fgsSize: 60,
  fgsType: 'ball-spin-clockwise',
  gap: 24,
  logoPosition: 'center-center',
  logoSize: 200,
  logoUrl: '../assets/images/ArbolRentaRaiz.png',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: '#060f29',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: false,
  text: '',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 300,
};

@NgModule({
  declarations: [],
  imports: [NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)],
  exports: [NgxUiLoaderModule],
})
export class LoaderModule {}
