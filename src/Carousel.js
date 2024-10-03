export default function Carousel(slides) {
  const $carouselSlide = document.querySelector('.carousel-slide');

  const totalSlides = slides.length; // 전체 슬라이드 개수

  $carouselSlide.style.width = `${totalSlides * 100}%`;

  this.currentSlide = 0;

  this.setCurrentSlide = (nextSlide) => {
    this.currentSlide = nextSlide;
    this.updateSlidePosition();
  };

  // 자동 슬라이드 전환 함수
  this.autoFlipSlide = (speed = 4000) => {
    this.slideInterval = setInterval(() => {
      this.setCurrentSlide((this.currentSlide + 1) % totalSlides);
    }, speed);
  };

  // 타이머 정리 함수
  this.clearAutoFlipSlide = () => {
    clearInterval(this.slideInterval);
  };

  // 슬라이드 위치를 업데이트하는 함수
  this.updateSlidePosition = () => {
    $carouselSlide.style.transform = `translateX(-${this.currentSlide * (100 / totalSlides)}%)`;
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

    this.autoFlipSlide();
  };

  // 초기 렌더링
  this.render();

  // 이벤트 해제 (페이지가 닫힐 때 타이머 제거)
  window.addEventListener('beforeunload', () => {
    this.clearAutoFlipSlide();
  });
}
