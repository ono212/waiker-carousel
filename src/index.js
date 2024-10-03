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
    carousel.clearAutoFlipSlide(); // 기존 슬라이드 전환 중지
    carousel.autoFlipSlide(speed); // 새 속도로 슬라이드 전환 시작
  },
});

const carousel = new Carousel(slides);
