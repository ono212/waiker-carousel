export function SlideDelayControl({ transitionSpeed, delay, onChange }) {
  const $transitionInput = document.querySelector('.transition-control-input');
  const $delayInput = document.querySelector('.delay-control-input');
  const $button = document.querySelector('.control-btn');

  this.transitionSpeed = transitionSpeed;
  this.delay = delay;

  this.render = () => {
    $transitionInput.value = null;
    $delayInput.value = null;

    $transitionInput.placeholder = `${this.transitionSpeed / 1000}초`;
    $delayInput.placeholder = `${this.delay / 1000}초`;
  };

  $button.addEventListener('click', () => {
    const newTransitionSpeed =
      parseInt($transitionInput.value * 1000) || this.transitionSpeed;

    const newDelaySpeed = parseInt($delayInput.value, 10) * 1000 || this.delay;

    onChange(newTransitionSpeed, newDelaySpeed);

    this.transitionSpeed = newTransitionSpeed;
    this.delay = newDelaySpeed;

    this.render();
  });

  this.render();
}
