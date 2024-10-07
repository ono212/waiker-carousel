import { addDragAndTouchEventHandlers } from '../utils/addDragAndTouchEventHandlers.js';

const DEFAULT_SLIDE_SPEED = 55_000; // 기본 슬라이드 속도

export function Carousel({ slides, carouselSlide, delay, transitionSpeed }) {
  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  slides.push(slides[0]); // 첫 번째 슬라이드 복제
  carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;
  this.isPlaying = true;

  const indicatorButtons = [];

  // 슬라이드 위치 업데이트
  this.updateSlidePosition = () => {
    carouselSlide.style.transition = `transform ${transitionSpeed}ms ease`;
    carouselSlide.style.transform = `translateX(-${
      (this.currentSlide * 100) / totalSlidesWithClone
    }%)`;

    // 마지막 슬라이드에서 첫 번째 슬라이드로 부드럽게 전환
    if (this.currentSlide === totalSlides) {
      setTimeout(() => {
        this.currentSlide = 0;
        carouselSlide.style.transition = 'none';
        carouselSlide.style.transform = `translateX(0%)`;
        this.updateIndicator();
      }, delay - 300);
    }
  };

  // 슬라이드 전환
  this.setCurrentSlide = (nextSlide) => {
    this.currentSlide = nextSlide;
    this.updateSlidePosition();
    this.updateIndicator();
  };

  // 자동 슬라이드 전환
  this.autoFlipSlide = (delayPlusTransitionSpeed = DEFAULT_SLIDE_SPEED) => {
    this.clearAutoFlipSlide();
    this.slideInterval = setInterval(() => {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }, delayPlusTransitionSpeed);
  };

  // 타이머 초기화
  this.clearAutoFlipSlide = () => clearInterval(this.slideInterval);

  // 인디케이터 업데이트
  this.updateIndicator = () => {
    indicatorButtons.forEach((button, index) => {
      button.classList.toggle(
        'selected',
        index === (this.currentSlide === totalSlides ? 0 : this.currentSlide),
      );
    });
  };

  // 인디케이터 생성
  const createIndicator = () => {
    const indicatorContainer = document.querySelector('.indicator-container');

    for (let i = 0; i < totalSlides; i++) {
      const button = document.createElement('button');
      button.classList.add('indicator-button');
      if (i === this.currentSlide) button.classList.add('selected');

      button.onclick = () => {
        this.setCurrentSlide(i);
        this.autoFlipSlide(delay + transitionSpeed);
      };

      indicatorContainer.appendChild(button);
      indicatorButtons.push(button);
    }

    // 재생/일시정지 버튼
    this.playPauseButton = document.createElement('button');
    this.playPauseButton.classList.add('play-pause-button');
    this.playPauseButton.innerHTML = '⏸';
    this.playPauseButton.onclick = this.togglePlayPause;
    indicatorContainer.appendChild(this.playPauseButton);
  };

  // 재생/일시정지 기능
  this.togglePlayPause = () => {
    if (this.isPlaying) {
      this.clearAutoFlipSlide();
      this.playPauseButton.innerHTML = '▶';
    } else {
      this.autoFlipSlide(delay + transitionSpeed);
      this.playPauseButton.innerHTML = '⏸';
    }
    this.isPlaying = !this.isPlaying;
  };

  // 네비게이션 버튼 생성
  const createNavigationButtons = () => {
    const $prevButton = document.querySelector('.prev-button');
    const $nextButton = document.querySelector('.next-button');

    $prevButton.onclick = () => this.navigateSlide('prev');
    $nextButton.onclick = () => this.navigateSlide('next');
  };

  // 슬라이드 이동
  this.navigateSlide = (direction) => {
    this.clearAutoFlipSlide();

    if (direction === 'prev') {
      if (this.currentSlide === 0) {
        this.currentSlide = totalSlides;
        carouselSlide.style.transition = 'none';
        carouselSlide.style.transform = `translateX(-${
          (this.currentSlide * 100) / totalSlidesWithClone
        }%)`;

        setTimeout(() => {
          carouselSlide.style.transition = `transform ${transitionSpeed}ms ease`;
          this.setCurrentSlide(totalSlides - 1);
        }, 300);
      } else {
        this.setCurrentSlide((this.currentSlide - 1) % totalSlidesWithClone);
      }
    } else {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }

    this.autoFlipSlide(delay + transitionSpeed);
  };

  // 슬라이드 생성
  this.render = () => {
    slides.forEach((slideSrc, index) => {
      const slideHTML = /* html */ `
        <div class="slide-container">
          <img
            class="slide-image"
            src="${slideSrc}"
            alt="슬라이드 ${index + 1}"
          />
        </div>
      `;
      carouselSlide.insertAdjacentHTML('beforeend', slideHTML);
    });

    createIndicator();
    createNavigationButtons();
    this.autoFlipSlide(delay + transitionSpeed);
  };

  this.render(); // 초기 렌더링
  addDragAndTouchEventHandlers(carouselSlide, this.navigateSlide); // 터치 이벤트, 드래그 이벤트 등록

  window.addEventListener('beforeunload', this.clearAutoFlipSlide); // 페이지가 닫힐 때 타이머 제거
}
