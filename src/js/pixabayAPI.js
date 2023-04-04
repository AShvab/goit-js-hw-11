'use strict';
import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34965824-045f8b70a8fe868dcc6efc926';

  page = 1;
  query = null;

  async fetchPhotos() {
    try {
      return await axios.get(`${this.#BASE_URL}`, {
        params: {
          q: this.query,
          page: this.page,
          per_page: 40,
          image_type: this.photo,
          safeseafch: true,
          orientation: this.horizontal,
          key: this.#API_KEY,
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

}