import Carousel from './Carousel.js';
import SlideSpeedControl from './SlideSpeedControl.js';

const slides = [
  './images/1.png',
  './images/2.png',
  './images/3.png',
  './images/4.png',
  './images/5.png',
];

new SlideSpeedControl({
  onChange: (speed) => {
    carousel.clearAutoFlipSlide();

    if (!carousel.isPlaying) {
      carousel.togglePlayPause();
    }

    carousel.autoFlipSlide(speed);
  },
});

const carousel = new Carousel(slides);
