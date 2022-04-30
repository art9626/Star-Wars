const cssPromises = {};
const appContainer = document.getElementById('app');
const episodeNumber = getPageParam('episode');

export function renderPage(js, api, css) {
  Promise.all(
    [js, api, css].map(item => loadResources(item))
  ).then(([pageModule, data]) => {
    appContainer.innerHTML = '';
    appContainer.append(pageModule.render(data));
  })
}

export function loadResources(src) {
  if (src.endsWith('.css')) {
    if (!cssPromises[src]) {
      cssPromises[src] = new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        document.head.append(link);
        link.addEventListener('load', () => {
          resolve();
        })
      })
    }

    return cssPromises[src];
  }

  if (src.endsWith('.js')) {
    return import(src);
  }

  return fetch(src).then(res => res.json());
}

updateState(episodeNumber);

window.addEventListener('popstate', () => {
  const episodeNumber = getPageParam('episode');
  updateState(episodeNumber);
})

export function updateState(param) {
  if (param) {
    renderPage('./movie-page.js', `https://swapi.dev/api/films/${param}`, './css/movie-page.css');
  } else {
    renderPage('./main-page.js', 'https://swapi.dev/api/films', './css/main-page.css');
  }
}

function getPageParam(paramName) {
  const pageParams = new URLSearchParams(location.search);

  return pageParams.get(`${paramName}`);
}