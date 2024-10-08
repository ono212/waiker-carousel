import { addDragAndTouchEventHandlers } from '../utils/addDragAndTouchEventHandlers.js';

const DEFAULT_TRANSITION_SPEED = 3_000; // 기본 슬라이드 속도

export function Carousel({
  slides,
  carouselSlide,
  delay,
  transitionSpeed = DEFAULT_TRANSITION_SPEED,
}) {
  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  slides.push(slides[0]); // 첫 번째 슬라이드 복제
  carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;
  this.isPlaying = true;
  this.delay = delay;

  let slideDelayTimeout = null;
  let lastSlideTimeout = null;

  const indicatorButtons = [];

  // 슬라이드 위치 업데이트
  this.updateSlidePosition = () => {
    carouselSlide.style.transition = `transform ${transitionSpeed}ms ease`;
    carouselSlide.style.transform = `translateX(-${
      (this.currentSlide * 100) / totalSlidesWithClone
    }%)`;

    if (this.currentSlide === totalSlides) {
      lastSlideTimeout = setTimeout(() => {
        this.currentSlide = 0;
        carouselSlide.style.transition = 'none';
        carouselSlide.style.transform = `translateX(0%)`;
        this.updateIndicator();
      }, transitionSpeed);
    }
  };

  // 슬라이드 전환
  this.setCurrentSlide = (nextSlide) => {
    this.currentSlide = nextSlide;

    this.updateSlidePosition();
    this.updateIndicator();
  };

  // 슬라이드 자동 전환
  this.startSlideDelay = () => {
    this.clearSlideDelay();

    // 슬라이드 전환이 끝나면 딜레이 후 다음 슬라이드로 이동
    slideDelayTimeout = setTimeout(() => {
      if (this.isPlaying)
        this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }, this.delay);
  };

  // 슬라이드 자동 전환 타이머 제거
  this.clearSlideDelay = () => {
    if (slideDelayTimeout) {
      clearTimeout(slideDelayTimeout);
      slideDelayTimeout = null;
    }
  };

  // 마지막 슬라이드에 걸린 타이머 제거
  this.clearLastSlideTimeout = () => {
    if (lastSlideTimeout) {
      clearTimeout(lastSlideTimeout);
      lastSlideTimeout = null;
    }
  };

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
        // 기존에 걸려있던 타이머 해제
        this.clearSlideDelay();
        this.clearLastSlideTimeout();

        this.setCurrentSlide(i);
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
    this.isPlaying = !this.isPlaying;
    this.playPauseButton.innerHTML = this.isPlaying ? '⏸' : '▶';

    if (this.isPlaying) this.startSlideDelay();
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
    // 타이머 해제
    this.clearSlideDelay();
    this.clearLastSlideTimeout();

    if (direction === 'prev') {
      if (this.currentSlide === 0) {
        this.currentSlide = totalSlides;
        carouselSlide.style.transition = 'none';
        carouselSlide.style.transform = `translateX(-${
          (this.currentSlide * 100) / totalSlidesWithClone
        }%)`;

        lastSlideTimeout = setTimeout(() => {
          carouselSlide.style.transition = `transform ${transitionSpeed}ms ease`;
          this.setCurrentSlide(totalSlides - 1);
        });
      } else {
        this.setCurrentSlide((this.currentSlide - 1) % totalSlidesWithClone);
      }
    } else {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }
  };

  // 슬라이드 생성
  this.render = () => {
    slides.forEach((slideSrc, index) => {
      const slideHTML = `
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
    this.startSlideDelay();
  };

  this.render(); // 초기 렌더링

  carouselSlide.addEventListener('transitionend', (event) => {
    // 트랜지션이 끝나면 delay를 시작
    if (event.propertyName === 'transform') this.startSlideDelay();
  });

  addDragAndTouchEventHandlers(carouselSlide, this.navigateSlide); // 터치 이벤트, 드래그 이벤트 등록

  // 페이지가 닫힐 때 타이머 제거
  window.addEventListener('beforeunload', () => {
    this.clearSlideDelay();
    this.clearLastSlideTimeout();
  });
}
