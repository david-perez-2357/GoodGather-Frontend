import {ElementRef, Renderer2} from '@angular/core';

function putBackground(renderer: Renderer2, imgSrc: string) {
  renderer.addClass(document.body, 'default-bg');

  const img = new Image();
  img.src = imgSrc;

  img.onload = () => {
    renderer.setStyle(document.body, 'backgroundImage', `url(${img.src})`);
  };
}

function putDefaultBackground(renderer: Renderer2) {
  putBackground(renderer, 'gg-default-background.png');
}

function putFormBackground(renderer: Renderer2) {
  putBackground(renderer, 'gg-form-background.png');
}

export {putDefaultBackground, putFormBackground};
