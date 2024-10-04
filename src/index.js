import { Carousel } from './components/Carousel.js';
import { SlideDelayControl } from './components/SlideDelayControl.js';

const slides = [
  './images/01-data-solution.webp',
  './images/02-ai-solution.webp',
  './images/03-ux-solution.webp',
  './images/04-prize.webp',
  './images/05-kbs.webp',
];

new SlideDelayControl({
  onChange: (delay) => {
    carousel.clearAutoFlipSlide();

    if (!carousel.isPlaying) {
      carousel.togglePlayPause();
    }

    carousel.autoFlipSlide(delay);
  },
});

const carousel = new Carousel({
  slides,
  carouselSlide: document.querySelector('.carousel-slide'),
  delay: 4000,
  transitionSpeed: 300,
});
