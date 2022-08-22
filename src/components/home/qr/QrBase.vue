<template>
  <div>
    <!-- <video id="player" autoplay ref="player"></video> -->
    <video id="player" autoplay></video>
    <!-- {{ err }} -->
    <!-- <input type="file" accept="image/*" capture="camera" @change="getQr" ref="input" /> -->
    {{ res }}
  </div>
</template>

<script setup>
/*eslint-disable */
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import QrScanner from 'qr-scanner';

// const err = ref('Hiba?');
const player = ref(null);
// const input = ref(null);
const res = ref('');

function initMedia() {
  console.log('initMedia');

  // if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) return;
  if (!('mediaDevices' in navigator)) navigator.mediaDevices = {};
  if (!('getUserMedia' in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) return Promise.reject(new Error('getUserMedia is not implemented!'));
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  console.log('Itt vagyo');
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      console.log('getUserMedia');
      const player = document.getElementById('player');
      player.srcObject = stream;
    })
    .catch(function (err) {
      err.value = err.message;
      console.log(err);
    });
}
function initLocation() {
  if (!('geolocation' in navigator)) console.error('Geolocation is not available');
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log('Siker', position);
    },
    function (err) {
      console.log('hiba', err);
    },
    { timeout: 7000 },
  );
}
onBeforeMount(() => {
  // initMedia();
  // initLocation();
  const qrScan = new QrScanner(document.querySelector('#player'), (result) => {
    console.log('result', result);
    res.value = result;
    // qrScan.destroy();
  });
  // qrScan.start();
});

function getQrOld() {
  const options = {
    // onUploadProgress(progressEvent) {
    //   const { loaded, total } = progressEvent;
    //   let percent = Math.floor((loaded * 100) / total);
    //   console.log(`${loaded}kb of ${total}kb | ${percent}%`);
    // },
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'multipart/form-data' },
  };

  const formData = new FormData();
  formData.append('file', input.value.files[0]);
  axios
    .create()
    .post('http://api.qrserver.com/v1/read-qr-code/', formData, options)
    .then(() => {
      input.value.value = '';
    })
    .catch(err => {
      input.value.value = '';
      console.log('HIBA', err);
    });
}

function getQr2() {
  // QrScanner.
  QrScanner.scanImage(input.value.files[0])
    .then(result => {
      console.log('result', result);
      res.value = result;
      input.value.value = '';
    })
    .catch(error => console.log(error || 'No QR code found.'));
}
</script>

<style lang="scss" scoped>
// canvas,
video {
  width: 512px;
  max-width: 100%;
  margin: auto;
  background-color: aquamarine;
}
</style>
