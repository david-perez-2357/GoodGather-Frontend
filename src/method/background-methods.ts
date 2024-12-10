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

/**
 * Put a background image on the body
 * @param renderer Renderer2
 * @param Background
 * @returns void
 */
function putBackground(renderer: Renderer2,Background: Background) {
  renderer.addClass(document.body, Background.className);

  const img = new Image();
  img.src = Background.image;

  img.onload = () => {
    renderer.setStyle(document.body, 'backgroundImage', `url(${img.src})`);
  };
}

/**
 * Remove the background image and class from the body
 * @param renderer Renderer2
 * @param Background Background
 * @returns void
 */
function removeBackgroundAndClass(renderer: Renderer2, Background: Background) {
  renderer.removeStyle(document.body, 'backgroundImage');
  renderer.removeClass(document.body, Background.className);
}

/**
 * Put the default background on the body
 * @param renderer Renderer2
 * @returns void
 */
function putDefaultBackground(renderer: Renderer2) {
  putBackground(renderer, defaultBackground);
}

/**
 * Put the form background on the body
 * @param renderer Renderer2
 * @returns void
 */
function putFormBackground(renderer: Renderer2) {
  putBackground(renderer, formBackground);
}

/**
 * Remove the default background from the body
 * @param renderer Renderer2
 * @returns void
 */
function removeDefaultBackground(renderer: Renderer2) {
  removeBackgroundAndClass(renderer, defaultBackground);
}

/**
 * Remove the form background from the body
 * @param renderer Renderer2
 * @returns void
 */
function removeFormBackground(renderer: Renderer2) {
  removeBackgroundAndClass(renderer, formBackground);
}

export {putDefaultBackground, putFormBackground, removeDefaultBackground, removeFormBackground};
