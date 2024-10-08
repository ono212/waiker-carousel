import { Carousel } from './components/Carousel.js';
import { SlideDelayControl } from './components/SlideDelayControl.js';

const slides = [
  './images/01-data-solution.webp',
  './images/02-ai-solution.webp',
  './images/03-ux-solution.webp',
  './images/04-prize.webp',
  './images/05-kbs.webp',
];

const carousel = new Carousel({
  slides,
  carouselSlide: document.querySelector('.carousel-slide'),
  delay: 1000,
  transitionSpeed: 2000,
});

new SlideDelayControl({
  transitionSpeed: carousel.transitionSpeed,
  delay: carousel.delay,
  onChange: (newTransitionSpeed, newDelaySpeed) => {
    carousel.clearSlideDelay();

    if (!carousel.isPlaying) {
      carousel.togglePlayPause();
    }

    carousel.transitionSpeed = newTransitionSpeed;
    carousel.delay = newDelaySpeed;
    carousel.startSlideDelay();
  },
});
