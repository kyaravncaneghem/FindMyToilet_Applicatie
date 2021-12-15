import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';
import { API_KEY } from './keys';
import { Image } from 'image';
import { data } from './data';

/* Settings */
function sendSettings() {
  const settings = {
    items: settingsStorage.getItem('items')
      ? JSON.parse(settingsStorage.getItem('items')).map((item) => ({
          name: item.name ? JSON.parse(item.name).name : '',
          letter: item.letter ? JSON.parse(item.letter).value : '',
          color: item.color ? JSON.parse(item.color) : '',
        }))
      : [],
    list: settingsStorage.getItem('list')
      ? JSON.parse(settingsStorage.getItem('list')).map((item) => item.value)
      : [],
    letter: settingsStorage.getItem('letter')
      ? JSON.parse(settingsStorage.getItem('letter')).values[0].value
      : '',
  };

  outbox
    .enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* Sending short messages */
function sendShortMessage() {
  const data = {
    companionTimestamp: new Date().getTime(),
  };

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

messaging.peerSocket.addEventListener('open', () => {
  setInterval(sendShortMessage, 10000);
});

messaging.peerSocket.addEventListener('error', (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

/* API Fetch */
async function fetchLocationName(coords) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  let location = '';
  json.features.forEach((feature) => {
    if (
      !location &&
      (feature.place_type[0] === 'locality' ||
        feature.place_type[0] === 'place')
    ) {
      location = feature.text;
    }
  });

  outbox
    .enqueue('location.cbor', cbor.encode({ location }))
    .then(() => console.log(location + ' as location sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

/* send data */
async function getListData() {
  const listData = data.map((item) => {
    return {
      name: item.name,
      user: item.user,
      id: item.id,
      type: item.type,
    };
  });

  console.log(listData);

  outbox
    .enqueue('listData.cbor', cbor.encode({ listData }))
    .then(() => console.log('listData sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

async function getListItem(id) {
  const listItem = data.find((item) => {
    return id === item.id;
  });

  console.log(listItem);

  outbox
    .enqueue('listItem.cbor', cbor.encode({ listItem }))
    .then(() => console.log(' listItem sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

/* Get Map */
async function getMap(coords) {
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/url-https%3A%2F%2Fi.postimg.cc%2FyxnRd0st%2Fbol.png(${coords.longitude},${coords.latitude}),url-https%3A%2F%2Fi.postimg.cc%2FBnHb6xS6%2F1.png(4.4034,51.226489),url-https%3A%2F%2Fi.postimg.cc%2F63rRkDS9%2F2.png(4.417814,51.225997),url-https%3A%2F%2Fi.postimg.cc%2FhG7VrJ1Q%2F3.png(4.423464,51.226206),url-https%3A%2F%2Fi.postimg.cc%2FC1Tk6FcP%2F4.png(4.420361,51.221411),url-https%3A%2F%2Fi.postimg.cc%2FMHzRq921%2F5.png(4.406225,51.219603)/auto/336x168?access_token=${API_KEY}`;

  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Image.from(buffer, 'image/png'))
    .then((image) =>
      image.export('image/jpeg', {
        background: '#000000',
        quality: 40,
      }),
    )
    .then((buffer) => outbox.enqueue(`map-${Date.now()}.jpg`, buffer))
    .then((fileTranser) => {
      console.log(`Enqueued${fileTranser.name}`);
    });
}

/* Location functions */
function locationSuccess(location) {
  fetchLocationName(location.coords);
  getMap(location.coords);
}

function locationError(error) {
  console.log(`Error: ${error.code}`, `Message: ${error.message}`);
  // Handle location error (send message to device to show error)
}

/* Handle messages coming from device */
function processMessaging(evt) {
  console.log(evt.data);
  switch (evt.data.command) {
    case 'getListData':
      getListData();
      break;
    case 'getListItem':
      getListItem(evt.data.id);
      break;
    case 'location':
      geolocation.getCurrentPosition(locationSuccess, locationError);
      break;
    default:
      //
      break;
  }
}

messaging.peerSocket.addEventListener('message', processMessaging);
