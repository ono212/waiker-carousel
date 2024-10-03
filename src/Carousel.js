export default function Carousel(slides) {
  const $carouselSlide = document.querySelector('.carousel-slide');

  const totalSlides = slides.length;
  const totalSlidesWithClone = totalSlides + 1; // 복제된 슬라이드를 포함한 총 슬라이드 개수

  // 부드러운 전환 효과를 위해 첫 번째 슬라이드를 마지막 요소로 복제
  slides.push(slides[0]);

  $carouselSlide.style.width = `${totalSlidesWithClone * 100}%`;

  this.currentSlide = 0;

  const indicatorButtons = [];

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

      button.onclick = () => this.setCurrentSlide(i);
      indicatorContainer.appendChild(button);
      indicatorButtons.push(button);
    }
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
    this.autoFlipSlide();
  };

  // 초기 렌더링
  this.render();

  // 이벤트 해제 (페이지가 닫힐 때 타이머 제거)
  window.addEventListener('beforeunload', () => {
    this.clearAutoFlipSlide();
  });
}
