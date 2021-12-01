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
let $map = null;
let myList = null;

function draw() {
  if (getStateItem('map')) {
    $map.href = getStateItem('map');
  }
  const list = getStateItem('listData');

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

        let touch = tile.getElementById('touch');
        touch.onclick = function () {
          setStateItem('detailId', info.value.id);
          switchPage('toilet', true);
        };
      }
    },
  };
  myList.length = list.length;
}

export function destroy() {
  console.log('destroy route page');
  $button = null;
  $map = null;
  myList = null;
  removeStateCallback('route');
}

export function init() {
  getListData();
  setStateCallback('index', draw);

  console.log('init route page');
  myList = document.getElementById('myList');

  $button = document.getElementById('back-button');
  $map = document.getElementById('map');
  $button.onclick = () => {
    destroy();
    switchPage('index');
  };
  setStateCallback('route', draw);
}
