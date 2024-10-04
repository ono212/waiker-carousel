export function SlideDelayControl({ onChange }) {
  const $input = document.querySelector('.delay-control-input');
  const $button = document.querySelector('.delay-control-btn');

  $button.addEventListener('click', () => {
    const delay = parseInt($input.value, 10) || 4;
    onChange(delay * 1000);
  });
}
