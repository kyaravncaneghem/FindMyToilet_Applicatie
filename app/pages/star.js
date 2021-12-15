import document from 'document';
import { switchPage } from '../navigation';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';

let $button = null;
let $letter = null;

function draw() {
  const letter = getStateItem('letter');

  if (letter) {
    $letter.text = letter;
  } else {
    $letter.text = 'set letter';
  }
}

export function destroy() {
  console.log('destroy star page');
  $button = null;
  $letter = null;
  removeStateCallback('star');
}

export function init() {
  console.log('init star page');
  $letter = document.getElementById('letter');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    switchPage('index');
  };
  setStateCallback('star', draw);
  draw();
}
