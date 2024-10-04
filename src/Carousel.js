export default function Carousel(slides) {
  const $carousel = document.querySelector('.carousel');
  const $carouselSlide = document.querySelector('.carousel-slide');

  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  // 부드러운 전환 효과를 위해 첫 번째 슬라이드를 마지막 요소로 복제
  slides.push(slides[0]);

  $carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;

  const indicatorButtons = [];

  this.isPlaying = true;

  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;

  this.setCurrentSlide = (nextSlide) => {
    this.currentSlide = nextSlide;
    this.updateSlidePosition();
    this.updateIndicator();
  };

  // 자동 슬라이드 전환 함수
  this.autoFlipSlide = (speed = 4000) => {
    this.slideInterval = setInterval(() => {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlidesWithClone);
    }, speed);
  };

  // 타이머 정리 함수
  this.clearAutoFlipSlide = () => {
    clearInterval(this.slideInterval);
  };

  // 슬라이드 위치를 업데이트하는 함수
  this.updateSlidePosition = () => {
    $carouselSlide.style.transition = 'transform 0.3s ease';
    $carouselSlide.style.transform = `translateX(-${(this.currentSlide * 100) / totalSlidesWithClone}%)`;

    // 마지막 슬라이드에서 첫 번째 슬라이드로 부드럽게 전환
    if (this.currentSlide === totalSlides) {
      setTimeout(() => {
        this.currentSlide = 0;
        $carouselSlide.style.transition = 'none';
        $carouselSlide.style.transform = `translateX(0%)`; // 첫 번째 슬라이드로 이동
        this.updateIndicator();
      }, 300);
    }
  };

  // 인디케이터 상태를 업데이트하는 함수
  this.updateIndicator = () => {
    indicatorButtons.forEach((button, index) => {
      button.classList.toggle(
        'selected',
        index === (this.currentSlide === totalSlides ? 0 : this.currentSlide),
      ); // 선택된 인디케이터 업데이트
    });
  };

  // 페이지네이션 인디케이터
  const createIndicator = () => {
    const indicatorContainer = document.querySelector('.indicator-container');

    for (let i = 0; i < totalSlides; i++) {
      const button = document.createElement('button');
      button.classList.add('indicator-button');

      if (i === this.currentSlide) button.classList.add('selected');

      button.onclick = () => {
        this.clearAutoFlipSlide(); // 전환 간격 초기화
        this.autoFlipSlide();

        this.setCurrentSlide(i);
      };
      indicatorContainer.appendChild(button);
      indicatorButtons.push(button);
    }

    // 재생/일시정지 버튼
    this.playPauseButton = document.createElement('button');
    this.playPauseButton.classList.add('play-pause-button');
    this.playPauseButton.innerHTML = '⏸'; // 처음에는 일시정지 상태로 시작
    this.playPauseButton.onclick = () => this.togglePlayPause();
    indicatorContainer.appendChild(this.playPauseButton);
  };

  // 슬라이드 이동 버튼 생성 함수
  const createNavigationButtons = () => {
    const $prevButton = document.querySelector('.prev-button');
    const $nextButton = document.querySelector('.next-button');

    $prevButton.onclick = () => {
      this.clearAutoFlipSlide(); // 전환 간격 초기화

      if (this.currentSlide === 0) {
        // 현재 슬라이드가 첫 번째 슬라이드일 때
        this.currentSlide = totalSlides; // 마지막 슬라이드로 이동
        $carouselSlide.style.transition = 'none'; // transition을 제거하여 순간이동 효과
        $carouselSlide.style.transform = `translateX(-${(this.currentSlide * 100) / totalSlidesWithClone}%)`;

        setTimeout(() => {
          $carouselSlide.style.transition = 'transform 0.3s ease'; // 다시 transition 추가
          const nextSlide = totalSlides - 1; // 마지막 실제 슬라이드로 이동
          this.setCurrentSlide(nextSlide);
        }, 300);
      } else {
        const nextSlide = (this.currentSlide - 1) % totalSlidesWithClone;
        this.setCurrentSlide(nextSlide);
      }

      this.autoFlipSlide();
    };

    $nextButton.onclick = () => {
      this.clearAutoFlipSlide(); // 전환 간격 초기화

      const nextSlide = (this.currentSlide + 1) % totalSlidesWithClone;
      this.setCurrentSlide(nextSlide);

      this.autoFlipSlide();
    };
  };

  // 재생/일시정지 토글 함수
  this.togglePlayPause = () => {
    if (this.isPlaying) {
      this.clearAutoFlipSlide();
      this.playPauseButton.innerHTML = '▶';
    } else {
      this.autoFlipSlide(); // 슬라이드 전환 재개
      this.playPauseButton.innerHTML = '⏸';
    }

    this.isPlaying = !this.isPlaying;
  };

  this.render = () => {
    // 슬라이드 개수만큼 각각 태그 추가
    slides.forEach((slideSrc, index) => {
      const slideHTML = `
              <div class="slide-container">
                  <img 
                      src="${slideSrc}" 
                      alt="슬라이드 ${index + 1}" 
                      style="width: 100%; height: 100%; object-fit: cover;"
                  >
              </div>
            `;

      $carouselSlide.insertAdjacentHTML('beforeend', slideHTML);
    });

    createIndicator(); // 인디케이터 생성
    createNavigationButtons(); // 슬라이드 이동 버튼 생성
    this.autoFlipSlide();
  };

  // 초기 렌더링
  this.render();

  // 터치 시작 이벤트 핸들러
  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX; // 터치 시작 위치 기록
    startY = event.touches[0].clientY; // 터치 시작 위치 기록
  };

  // 터치 이동 이벤트 핸들러
  const handleTouchMove = (event) => {
    endX = event.touches[0].clientX; // 터치 이동 위치 기록
    endY = event.touches[0].clientY; // 터치 이동 위치 기록
  };

  // 터치 종료 이벤트 핸들러
  const handleTouchEnd = () => {
    const swipeDistanceX = endX - startX;
    const swipeDistanceY = endY - startY;

    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
      if (startX < endX && endX - startX >= 50) {
        // 오른쪽으로 스와이프
        this.clearAutoFlipSlide();

        if (this.currentSlide === 0) {
          this.currentSlide = totalSlides; // 마지막 슬라이드로 이동
          $carouselSlide.style.transition = 'none';
          $carouselSlide.style.transform = `translateX(-${(this.currentSlide * 100) / totalSlidesWithClone}%)`;

          setTimeout(() => {
            $carouselSlide.style.transition = 'transform 0.3s ease';
            const nextSlide = totalSlides - 1;
            this.setCurrentSlide(nextSlide);
          }, 300);
        } else {
          const nextSlide = (this.currentSlide - 1) % totalSlidesWithClone;
          this.setCurrentSlide(nextSlide);
        }
        this.autoFlipSlide();
      } else if (startX > endX && startX - endX >= 50) {
        // 왼쪽으로 스와이프
        this.clearAutoFlipSlide();
        const nextSlide = (this.currentSlide + 1) % totalSlidesWithClone;
        this.setCurrentSlide(nextSlide);
        this.autoFlipSlide();
      }
    }
  };

  // 터치 이벤트 리스너 등록
  $carousel.addEventListener('touchstart', handleTouchStart);
  $carousel.addEventListener('touchmove', handleTouchMove);
  $carousel.addEventListener('touchend', handleTouchEnd);

  // 이벤트 해제 (페이지가 닫힐 때 타이머 제거)
  window.addEventListener('beforeunload', () => {
    this.clearAutoFlipSlide();
  });
}
