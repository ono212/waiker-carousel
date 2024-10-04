import { getClientCoordinate } from '../utils/dom.js';

const SWIPE_DISTANCE_THRESHOLD_IN_PIXEL = 50; // 스와이프 임계값
const DEFAULT_SLIDE_SPEED = 55_000; // 기본 슬라이드 속도

export function Carousel({ slides, carouselSlide, delay, transitionSpeed }) {
  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  slides.push(slides[0]); // 첫 번째 슬라이드 복제
  carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;
  this.isPlaying = true;
  let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    isDragging = false;

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

  // 마우스 드래그 및 터치 무브 이벤트 핸들러
  const handleDragAndTouchMoveEvents = () => {
    const handlePointerDown = (event) => {
      const { clientX, clientY } = getClientCoordinate(event);

      startX = clientX;
      startY = clientY;
      isDragging = true;
      event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (!isDragging) return;
      const { clientX, clientY } = getClientCoordinate(event);

      endX = clientX;
      endY = clientY;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;

      const swipeDistanceX = endX - startX;
      const swipeDistanceY = endY - startY;

      const angle = Math.abs(swipeDistanceY / swipeDistanceX);

      // 이동 거리가 50px이상 && 이동 각도가 45도 미만일 때만 드래그
      if (
        Math.abs(swipeDistanceX) > SWIPE_DISTANCE_THRESHOLD_IN_PIXEL &&
        angle < 1
      ) {
        this.navigateSlide(swipeDistanceX > 0 ? 'prev' : 'next');
      }

      isDragging = false;
    };

    carouselSlide.addEventListener('mousedown', handlePointerDown);
    carouselSlide.addEventListener('mousemove', handlePointerMove);
    carouselSlide.addEventListener('mouseup', handlePointerUp);
    carouselSlide.addEventListener('mouseleave', handlePointerUp); // 캐러셀 바깥으로 나갈 때 드래그 종료하도록

    carouselSlide.addEventListener('touchstart', handlePointerDown);
    carouselSlide.addEventListener('touchmove', handlePointerMove);
    carouselSlide.addEventListener('touchend', handlePointerUp);
  };

  // 초기 렌더링 및 터치 이벤트, 드래그 이벤트 등록
  this.render();
  handleDragAndTouchMoveEvents();

  // 페이지가 닫힐 때 타이머 제거
  window.addEventListener('beforeunload', this.clearAutoFlipSlide);
}
