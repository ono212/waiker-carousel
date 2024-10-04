export const getClientCoordinate = (e) => {
  let [clientX, clientY] = [0, 0];

  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return { clientX, clientY };
};
