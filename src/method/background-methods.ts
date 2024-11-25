import {Renderer2} from '@angular/core';
import Background from '@/interface/Background';


const defaultBackground: Background = {
  image: 'gg-default-background.png',
  className: 'default-bg'
}

const formBackground: Background = {
  image: 'gg-form-background.png',
  className: 'form-bg'
}

function putBackground(renderer: Renderer2,Background: Background) {
  renderer.addClass(document.body, Background.className);

  const img = new Image();
  img.src = Background.image;

  img.onload = () => {
    renderer.setStyle(document.body, 'backgroundImage', `url(${img.src})`);
  };
}

function removeBackgroundAndClass(renderer: Renderer2, Background: Background) {
  renderer.removeStyle(document.body, 'backgroundImage');
  renderer.removeClass(document.body, Background.className);
}

function putDefaultBackground(renderer: Renderer2) {
  putBackground(renderer, defaultBackground);
}

function putFormBackground(renderer: Renderer2) {
  putBackground(renderer, formBackground);
}

function removeDefaultBackground(renderer: Renderer2) {
  removeBackgroundAndClass(renderer, defaultBackground);
}

function removeFormBackground(renderer: Renderer2) {
  removeBackgroundAndClass(renderer, formBackground);
}

export {putDefaultBackground, putFormBackground, removeDefaultBackground, removeFormBackground};
