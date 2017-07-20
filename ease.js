const startTime = 7;
const endTime = 23.5;
const cigarettes = 16;

// t: current time
// start value
const b = 0;
// change in value
const c = (endTime - startTime) / (cigarettes - 1);
// duration
const d = cigarettes;

function linearTween(t, b, c, d) {
  return c * t / d + b;
};

function easeOutQuad(t, b, c, d) {
  t/= d;
  return -c * t * (t - 2) + b;
};

function easeInQuad(t, b, c, d) {
	t/= d;
	return c * t * t + b;
};

function convertToHHMM(fractionalTime) {
  var hours = parseInt(Number(fractionalTime));
  var minutes = Math.round((Number(fractionalTime) - hours) * 60);

  hours+= startTime;

  minutes = minutes < 10 ? '0' + minutes : minutes;
  hours = hours < 10 ? '0' + hours : hours;

  return `${hours}:${minutes}`;
}

for (var t = b; t < d; t++) {
  console.log(convertToHHMM(linearTween(t, b, c, d) * cigarettes)) ;
}
