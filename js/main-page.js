import { updateState } from "./render-app.js";

export function render(data) {
  const container = document.createElement('div');
  container.classList.add('container')

  const header = document.createElement('header');
  const headerLogo = document.createElement('a');
  const headerImg = document.createElement('img');

  header.classList.add('header');
  headerLogo.classList.add('header__logo');
  headerImg.classList.add('header__img');

  headerLogo.href = './index.html';
  headerImg.src = './img/star-wars-logo-981.png';
  headerImg.alt = 'logo';

  headerLogo.append(headerImg);
  header.append(headerLogo);

  const mainSection = document.createElement('section');
  const list = document.createElement('ul');

  mainSection.classList.add('section-main');
  list.classList.add('section-main__list');

  data.results.forEach((el, index) => {
    const listItem = document.createElement('li');
    const title = document.createElement('a');

    listItem.classList.add('section-main__item', `section-main__item--${el.episode_id}`);
    if (el.episode_id === 4) {
      listItem.classList.add('active');
    }
    title.classList.add('section-main__item-title');

    title.textContent = el.title;
    title.href = `?episode=${index + 1}`;

    listItem.append(title);
    list.append(listItem)

    listItem.addEventListener('click', e => {
      if (e._clickWithoutTitle) return;
      mainPageSlider(e)
    });

    title.addEventListener('click', e => {
      e._clickWithoutTitle = true;
      e.preventDefault();
      
      history.pushState(null, '', e.target.getAttribute('href'));
      updateState(e.target.href.slice(-1));
    })
  })

  mainSection.append(list);



  container.append(header);
  container.append(mainSection);


  return container;
} 



function mainPageSlider(e) {
  const slides = document.querySelectorAll('.section-main__item');
  slides.forEach(el => {
    el.classList.remove('active');
  });
  e.target.classList.add('active');
}