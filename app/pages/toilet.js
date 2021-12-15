import document from 'document';
import { switchPage } from '../navigation';
import { getListData } from '../commands';
import {
  getStateItem,
  setStateCallback,
  removeStateCallback,
  setStateItem,
} from '../state';

let $button = null;
let myList = null;
let loader = null;

function draw() {
  const list = getStateItem('listData');

  if (list && list.length) {
    myList.delegate = {
      getTileInfo: (index) => {
        return {
          type: 'my-pool',
          value: list[index],
          index: index,
        };
      },
      configureTile: (tile, info) => {
        console.log(`Item: ${info.index}`);
        if (info.type == 'my-pool') {
          tile.getElementById('text').text = `${info.value.name}`;
          tile.getElementById('subtitle').text = `${info.value.user}`;
          let touch = tile.getElementById('touch');
          touch.onclick = function () {
            setStateItem('detailId', info.value.id);
            switchPage('route', true);
          };
        }
      },
    };
    myList.length = list.length;
    loader.style.display = 'none';
  } else {
    loader.style.display = 'inline';
  }
}

export function destroy() {
  console.log('destroy toilet page');
  $button = null;
  myList = null;
  loader = null;
  removeStateCallback('toilet');
}

export function init() {
  myList = document.getElementById('myList');
  loader = document.getElementById('loader');
  getListData();

  console.log('init toilet page');

  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };
  setStateCallback('toilet', draw);
  draw();
}
