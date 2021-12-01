import document from 'document';
import { switchPage } from '../navigation';
import { gettext } from 'i18n';
import { removeStateCallback } from '../state';

let $buttonToilet = null;
let $buttonRoute = null;
let $buttonStar = null;

function doSomething() {
  console.log('hallo detail');
  console.log(gettext('stars'));
}

export function destroy() {
  console.log('destroy index page');
  $buttonToilet = null;
  $buttonRoute = null;
  $buttonStar = null;
  removeStateCallback('index');
}

export function init() {
  console.log('init index page');

  $buttonToilet = document.getElementById('toilet-button');
  $buttonRoute = document.getElementById('route-button');
  $buttonStar = document.getElementById('star-button');

  $buttonToilet.onclick = () => {
    switchPage('toilet', true);
  };
  $buttonRoute.onclick = () => {
    switchPage('route', true);
  };
  $buttonStar.onclick = () => {
    switchPage('star', true);
  };
}

doSomething();
