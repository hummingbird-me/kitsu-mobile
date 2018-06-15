import store from 'kitsu/store/config';
import { isEmpty } from 'lodash';

/**
 * A class to help with uploading images.
 */
export class ImageUploader {
  /**
   * Creates an instance of ImageUploader.
   * This will automatically add `Authorization` header and set the method to `POST`.
   * If you would like to override the request method then please pass it into opts.
   *
   * @param {string} url The url to upload images to.
   * @param {object} [opts={}] Request Options. I.e headers, method
   */
  constructor(url, opts = {}) {
    this.url = url;
    this.opts = opts;
    this.xhr = null;
  }

  /**
   * Start uploading images.
   * The passed in image objects must have `uri` and `mime` properties.
   *
   * This will return a rejection if:
   *    - You are already uploading images
   *    - Authorization tokens are not set
   *    - An error occurs while uploading.
   *
   * @param {[any]} images An array of images
   * @param {function} [onProgress=null] The progress callback.
   * @returns A Promise which will succeed once images upload.
   */
  upload(images, onProgress = null) {
    return new Promise((resolve, reject) => {
      if (this.xhr) {
        reject({
          status: -1,
          error: 'Already uploading images',
        });
      }

      // Check if we have the right tokens
      const tokens = store.getState().auth.tokens;
      if (isEmpty(tokens) || isEmpty(tokens.access_token)) {
        reject({
          status: -1,
          error: 'Missing authentication tokens',
        });
      }

      this.xhr = new XMLHttpRequest();
      this.xhr.open(this.opts.method || 'POST', this.url);

      // Map headers
      const headers = this.opts.headers || {};
      headers.Authorization = `Bearer ${tokens.access_token}`;
      Object.keys(headers).forEach((k) => {
        this.xhr.setRequestHeader(k, headers[k]);
      });

      // Events
      this.xhr.onload = () => {
        const status = this.xhr.status;
        if (status >= 200 && status < 300) {
          resolve(this.xhr.response);
        } else {
          reject({
            status,
            error: this.xhr.responseText,
          });
        }
        this.xhr = null;
      };

      this.xhr.onerror = () => {
        reject({
          status: this.xhr.status,
          error: this.xhr.responseText,
        });
        this.xhr = null;
      };

      if (this.xhr.upload && onProgress) {
        this.xhr.upload.onprogress = onProgress;
      }

      // Compile file data
      const data = new FormData();
      images.forEach((image, index) => {
        if (isEmpty(image.uri) || isEmpty(image.mime)) {
          reject({
            status: -1,
            error: 'Images must contain `uri` and `mime` properties.',
          });
          this.xhr = null;
        }

        data.append('files[]', {
          uri: image.uri,
          type: image.mime,
          name: `image-${index}`,
        });
      });

      // Upload away
      this.xhr.send(data);
    });
  }

  /**
   * Check wether images are being uploaded.
   */
  isUploading() {
    return !!this.xhr;
  }

  /**
   * Abort any upload tasks.
   */
  abort() {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
  }
}
