

// Connect to a peripheral running the echo service
// https://github.com/noble/bleno/blob/master/examples/echo

// subscribe to be notified when the value changes
// start an interval to write data to the characteristic

const noble = require('noble');
const chalk = require('chalk');

const LOCAL_NAME = "O-Click";
const PERIPHERAL_ID = "f61f624914da4314a3a0b4afb962aea2";
const PERIPHERAL_ADDRESS = "d0:39:72:d6:0d:47";

const SERVICE_UUID = "ffe0";
const CHARACTERISTIC_UUID = 'f000ffe104514000b000000000000000';

noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', peripheral => {
  // connect to the first peripheral that is scanned
  if (peripheral.id === PERIPHERAL_ID || peripheral.address === PERIPHERAL_ADDRESS || peripheral.advertisement.localName === LOCAL_NAME) {
    noble.stopScanning();
    const name = peripheral.advertisement.localName;
    console.log(`Connecting to '${chalk.bold.blue(name)}' ${chalk.bold.blueBright(peripheral.id)}`);
    connectAndSetUp(peripheral);
  }
});

function connectAndSetUp(peripheral) {
  peripheral.connect(error => {
    console.log(`Connected to ${chalk.bold.blue(peripheral.id)}`);

    // specify the services and characteristics to discover
    const serviceUUIDs = [SERVICE_UUID];
    const characteristicUUIDs = [CHARACTERISTIC_UUID];

    peripheral.discoverSomeServicesAndCharacteristics(
      serviceUUIDs,
      characteristicUUIDs,
      onServicesAndCharacteristicsDiscovered
    );
  });

  peripheral.on('disconnect', () => console.log('disconnected'));
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
  console.log(chalk.gray(`Discovered services and characteristics`));
  const echoCharacteristic = characteristics[0];

  // data callback receives notifications
  echoCharacteristic.on('data', (data, isNotification) => {
    console.log(chalk.bold.green('Click ...'));
  });

  // subscribe to be notified whenever the peripheral update the characteristic
  echoCharacteristic.subscribe(error => {
    if (error) {
      console.error('Error subscribing to echoCharacteristic');
    } else {
      console.log(chalk.gray(`Subscribed for 'click notification characteristic' notifications`));
    }
  });
}
