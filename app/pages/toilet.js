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

function draw() {
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
          switchPage('index', true);
        };
      }
    },
  };
  myList.length = list.length;
}

export function destroy() {
  console.log('destroy toilet page');
  $button = null;
  myList = null;
  removeStateCallback('toilet');
}

export function init() {
  getListData();
  setStateCallback('index', draw);

  console.log('init toilet page');
  myList = document.getElementById('myList');

  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };
  setStateCallback('toilet', draw);
}
