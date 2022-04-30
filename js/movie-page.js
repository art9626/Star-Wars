import { loadResources, updateState } from "./render-app.js";

export function render(data) {
  const mainContainer = document.createElement('div');
  const sectionBanner = document.createElement('section');
  const sectionAbout = document.createElement('section');
  const container = document.createElement('div');
  const leftBox = document.createElement('div');  
  const rightBox = document.createElement('div');
  const poster = document.createElement('img');
  const heading = document.createElement('h1');
  const description = document.createElement('p');
  const backBtn = document.createElement('a');

  mainContainer.classList.add('main-container');
  sectionBanner.classList.add('section__banner', `section__banner--${data.episode_id}`);
  sectionAbout.classList.add('section-about');
  container.classList.add('container', 'section-about__container');
  leftBox.classList.add('section-about__box', 'section-about__box--left');
  rightBox.classList.add('section-about__box', 'section-about__box--right');
  poster.classList.add('section-about__poster', `section-about__poster--${data.episode_id}`);
  heading.classList.add('section-about__heading');
  description.classList.add('section-about__description');
  backBtn.classList.add('section-about__btn');

  heading.textContent = `Episode ${data.episode_id}: ${data.title}`;
  description.textContent = data.opening_crawl;
  poster.alt = 'Poster';
  poster.src = `./img/poster-${data.episode_id}.jpeg`;
  backBtn.textContent = 'Back to episodes';
  backBtn.href = './index.html'

  backBtn.addEventListener('click', e => {
    e.preventDefault();
    
    history.pushState(null, '', e.target.href);
    updateState();
  })

  mainContainer.append(sectionBanner);
  mainContainer.append(sectionAbout);
  sectionAbout.append(container);
  container.append(leftBox);
  container.append(rightBox);
  leftBox.append(poster);
  rightBox.append(heading);
  rightBox.append(description);
  rightBox.append(backBtn);

  createContainerWithLists(['species', 'planets'], data).then(res => backBtn.before(res));

  return mainContainer;
}

async function createContainerWithLists(arrayOfKeys, data) {
  const dataForLists = await getDataForLists(arrayOfKeys, data);
  
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('section-about__lists');

  dataForLists.forEach((array, index) => {
    const containerForList = document.createElement('div');
    const heading = document.createElement('h2');
    const list = document.createElement('ul');

    containerForList.classList.add('section-about__list-container');
    heading.classList.add('section-about__list-heading');
    list.classList.add('section-about__list');
    heading.textContent = arrayOfKeys[index].slice(0,1).toUpperCase() + arrayOfKeys[index].slice(1);

    array.forEach(el => {
      const item = document.createElement('li');
      item.classList.add('section-about__list-item');
      item.textContent = el.name;
  
      list.append(item);
    });

    containerForList.append(heading);
    containerForList.append(list);
    mainContainer.append(containerForList);
  })

  return mainContainer;
}

function getDataForLists(arrayOfKeys, data) {
  return Promise.all(
    arrayOfKeys.map(key => Promise.all(data[key].map(item => loadResources(item))))
  ).then(res => res);
}