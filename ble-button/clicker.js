const BlePeripheral = require('./BlePeripheral');

const LOCAL_NAME = "O-Click";

const SERVICE_UUID = "ffe0";
const CHARACTERISTIC_UUID = 'f000ffe104514000b000000000000000';

let ble = new BlePeripheral(LOCAL_NAME);

ble.on('click', () => {
  console.log('click');
});

ble.discover()
  .then(() => {
    console.log('discovered');
    return ble.connect();
  })
  .then(() => {
    console.log('connected');
    return ble.fetchServicesAndCharacteristics();
  })
  .then(() => {
    return ble.subscribeAndListen(SERVICE_UUID, CHARACTERISTIC_UUID)
  })
  .catch(e => console.error(e));
