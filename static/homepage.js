window.onload = function () {
  randomCases();
  setInterval(randomCases, 20000);
};

function randomCases () {
  var title = document.querySelector('.hero__title');
  if (title == null) return;
  title.innerHTML = 'pnpm'.split('').map(l => Math.random() > 0.5 ? l.toUpperCase() : l).join('');
}

