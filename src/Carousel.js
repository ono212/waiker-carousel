export default function Carousel(slides) {
  const $carousel = document.querySelector('.carousel');
  const $carouselSlide = document.querySelector('.carousel-slide');

  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  slides.push(slides[0]); // 첫 번째 슬라이드 복제
  $carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;
  this.isPlaying = true;
  let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0;

  const indicatorButtons = [];

  // 슬라이드 위치 업데이트
  this.updateSlidePosition = () => {
    $carouselSlide.style.transition = 'transform 0.3s ease';
    $carouselSlide.style.transform = `translateX(-${(this.currentSlide * 100) / totalSlidesWithClone}%)`;

    // 마지막 슬라이드에서 첫 번째 슬라이드로 부드럽게 전환
    if (this.currentSlide === totalSlides) {
      setTimeout(() => {
        this.currentSlide = 0;
        $carouselSlide.style.transition = 'none';
        $carouselSlide.style.transform = `translateX(0%)`;
        this.updateIndicator();
      }, 300);
    }
  };

  // 슬라이드 전환
  this.setCurrentSlide = (nextSlide) => {
    this.currentSlide = nextSlide;
    this.updateSlidePosition();
    this.updateIndicator();
  };

  // 자동 슬라이드 전환
  this.autoFlipSlide = (speed = 4000) => {
    this.clearAutoFlipSlide();
    this.slideInterval = setInterval(() => {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }, speed);
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
        this.clearAutoFlipSlide();
        this.setCurrentSlide(i);
        this.autoFlipSlide();
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
      this.autoFlipSlide();
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
        $carouselSlide.style.transition = 'none';
        $carouselSlide.style.transform = `translateX(-${(this.currentSlide * 100) / totalSlidesWithClone}%)`;

        setTimeout(() => {
          $carouselSlide.style.transition = 'transform 0.3s ease';
          this.setCurrentSlide(totalSlides - 1);
        }, 300);
      } else {
        this.setCurrentSlide((this.currentSlide - 1) % totalSlidesWithClone);
      }
    } else {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }

    this.autoFlipSlide();
  };

  // 슬라이드 생성
  this.render = () => {
    slides.forEach((slideSrc, index) => {
      const slideHTML = `
        <div class="slide-container">
          <img src="${slideSrc}" alt="슬라이드 ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;
      $carouselSlide.insertAdjacentHTML('beforeend', slideHTML);
    });

    createIndicator();
    createNavigationButtons();
    this.autoFlipSlide();
  };

  // 터치 이벤트 핸들러
  const handleTouchEvents = () => {
    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      endX = event.touches[0].clientX;
      endY = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const swipeDistanceX = endX - startX;
      const swipeDistanceY = endY - startY;
      const isHorizontalSwipe =
        Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY); // 수평 스와이프인지 여부
      const swipeThreshold = 50; // 스와이프 임계값

      if (isHorizontalSwipe) {
        if (swipeDistanceX >= swipeThreshold) {
          this.navigateSlide('prev'); // 오른쪽으로 스와이프
        } else if (swipeDistanceX <= -swipeThreshold) {
          this.navigateSlide('next'); // 왼쪽으로 스와이프
        }
      }
    };

    $carousel.addEventListener('touchstart', handleTouchStart);
    $carousel.addEventListener('touchmove', handleTouchMove);
    $carousel.addEventListener('touchend', handleTouchEnd);
  };

  // 초기 렌더링, 터치 이벤트 등록
  this.render();
  handleTouchEvents();

  // 페이지가 닫힐 때 타이머 제거
  window.addEventListener('beforeunload', this.clearAutoFlipSlide);
}
