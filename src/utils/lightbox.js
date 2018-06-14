import store from 'kitsu/store/config';
import * as app from 'kitsu/store/app/actions';

/*
Helper class for showing and hiding lightbox
*/
class _Lightbox {
  show(images, initialIndex = 0) {
    store.dispatch(app.showLightbox(images, initialIndex));
  }

  hide() {
    store.dispatch(app.hideLightbox());
  }
}

export const Lightbox = new _Lightbox();
