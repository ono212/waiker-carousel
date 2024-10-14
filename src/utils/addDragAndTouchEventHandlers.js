import { getClientCoordinate } from './coordinateUtils.js';

const SWIPE_DISTANCE_THRESHOLD_IN_PIXEL = 50; // 스와이프 임계값

// 마우스 드래그 및 터치 무브 이벤트 핸들러
export const addDragAndTouchEventHandlers = (carouselSlide, navigateSlide) => {
  let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    isDragging = false;

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
    )
      navigateSlide(swipeDistanceX > 0 ? 'prev' : 'next');

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
