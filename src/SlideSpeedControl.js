export default function SlideSpeedControl({ onChange }) {
  const $input = document.querySelector('.speed-control-input');
  const $button = document.querySelector('.speed-control-btn');

  $button.addEventListener('click', () => {
    const speed = parseInt($input.value, 10) || 4;
    onChange(speed * 1000);
  });
}
