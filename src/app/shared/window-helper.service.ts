import { Injectable } from '@angular/core';

interface NewWindowParams {
  url: string;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class WindowHelperService {
  openWindow(params: NewWindowParams) {
    // https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - params.width) / 2 / systemZoom + dualScreenLeft;
    const top = (height - params.height) / 2 / systemZoom + dualScreenTop;

    const features = [
      'scrollbars=yes',
      `width=${params.width / systemZoom}`,
      `height=${params.height / systemZoom}`,
      `top=${top}`,
      `left=${left}`,
    ];

    return window.open(params.url, '', features.join(','));
  }
}
