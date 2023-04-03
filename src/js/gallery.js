'use strict'

import '../styles.css';
import { PixabayAPI } from './pixabayAPI';
import { createGalleryCard } from './createGalleryCard';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

const handleSearchFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayAPI.query = searchQuery;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    galleryListEl.innerHTML = createGalleryCard(data.hits);
    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (pixabayAPI.page === data.total_pages) {
      loadMoreBtnEl.classList.add('is-hidden');
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCard(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
};



searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);