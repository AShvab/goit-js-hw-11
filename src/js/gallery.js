
'use strict';
import '../styles.css';
import { PixabayAPI } from './pixabayAPI';
import { createGalleryCard } from './createGalleryCard';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a');

const handleSearchFormSubmit = async event => {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayAPI.query = searchQuery;

  try {
    clearSearchForm();
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (!searchQuery.trim()) {
      Notify.failure('Please enter valid search query.');
      return;
    }

    const totalHits = data.totalHits;
    

    galleryListEl.innerHTML = createGalleryCard(data.hits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    lightbox.refresh();

    if (data.hits.length < pixabayAPI.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
    if (galleryListEl.querySelectorAll('.photo-card').length >= data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

  } catch (err) {
    Notify.failure('Something wrong');
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.hits.length ) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");      
      return;
    }

    galleryListEl.insertAdjacentHTML('beforeend', createGalleryCard(data.hits));
    lightbox.refresh();

    if (galleryListEl.querySelectorAll('.photo-card').length >= data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

  } catch (err) {
    Notify.failure('Something wrong');
  }
};

const clearSearchForm = () => {
  galleryListEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
};

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

