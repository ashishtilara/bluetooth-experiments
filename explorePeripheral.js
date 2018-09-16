const noble = require('noble');
const chalk = require('chalk');

const PERIPHERAL = process.argv[2];

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
  if (peripheral.id === PERIPHERAL || peripheral.address === PERIPHERAL || peripheral.advertisement.localName === PERIPHERAL) {
    noble.stopScanning();
    const name = peripheral.advertisement.localName;
    console.log(`Connecting to '${chalk.bold.blue(name)}' ${chalk.bold.blueBright(peripheral.id)}`);
    connectAndSetUp(peripheral);
  }
});

function connectAndSetUp(peripheral) {
  peripheral.connect(error => {
    console.log(`Connected to ${chalk.bold.blue(peripheral.id)}`);
    let p = {
      'id': peripheral.id,
      'address': peripheral.address,
      'addressType': peripheral.addressType,
      'localName': peripheral.advertisement.localName,
      'serviceUuid': peripheral.advertisement.serviceUuids,
      'rssi': peripheral.rssi,
      'connectable': peripheral.connectable
    };
    if (peripheral.advertisement.txPowerLevel !== undefined) {
      p.txPowerLevel = peripheral.advertisement.txPowerLevel;
    }

    if (peripheral.advertisement.manufacturerData) {
      p.manufaturer = peripheral.advertisement.manufacturerData.toString('hex');
    }
    peripheral.discoverAllServicesAndCharacteristics((e, r) => {
      let o = {};
      r.forEach(service => {
        o[service.uuid] = {
          'uuid': service.uuid,
          'type': service.type,
          'name': service.name,
          'characteristics': {}
        };
        service.characteristics.forEach(c => {
          o[service.uuid].characteristics[c.uuid] = {
            'uuid': c.uuid,
            'type': c.type,
            'name': c.name,
            'properties': c.properties
          };
        });
      });

      p.services = o;
      console.log(JSON.stringify(p, null, 4));
      peripheral.disconnect();
    });
  });

  peripheral.on('disconnect', () => console.log('disconnected'));
}
