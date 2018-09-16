const noble = require('noble');
const EventEmitter = require('events');

class BlePeripheral extends EventEmitter {
  constructor(id) {
    super();
    this.peripheralId = id;
    this.peripheral = null;
    this.servicesAndCharacteristics = null;
    this.startScanning();
  }

  startScanning() {
    noble.on('stateChange', state => {
      if (state === 'poweredOn') {
        console.log('Scanning');
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });
  }

  discover() {
    console.log('discover');
    return new Promise((resolve) => {
      noble.on('discover', peripheral => {
        // connect to the first peripheral that is scanned
        if (peripheral.id === this.peripheralId || peripheral.address === this.peripheralId || peripheral.advertisement.localName === this.peripheralId) {
          noble.stopScanning();
          this.peripheral = peripheral;
          this.peripheral.on('disconnect', () => console.log('peripheral disconnected'));
          resolve(this);
        }
      });
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.peripheral.connect(error => {
        if (error) {
          return reject(errore);
        }
        resolve(this);
      });
    });
  }

  fetchServicesAndCharacteristics() {
    return new Promise((resolve, reject) => {
      this.peripheral.discoverAllServicesAndCharacteristics((error, servicesAndCharacteristics) => {
        if (error) {
          return reject(error);
        }
        let sAndC = {};
        servicesAndCharacteristics.forEach(service => {
          sAndC[service.uuid] = {
            'uuid': service.uuid,
            'type': service.type,
            'name': service.name,
            'characteristics': {}
          };
          service.characteristics.forEach(c => {
            sAndC[service.uuid].characteristics[c.uuid] = c;
          });
        });
        this.servicesAndCharacteristics = sAndC;
        resolve(this);
      });
    });
  }

  subscribeAndListen (service, characteristic) {
    const c = this.servicesAndCharacteristics[service].characteristics[characteristic];
    return new Promise((resolve,reject) => {
      // subscribe to be notified whenever the peripheral update the characteristic
      c.subscribe(error => {
        if (error) {
          return reject(error);
        }
        // data callback receives notifications
        c.on('data', () => {
          console.log('boom');
          this.emit('click');
        });
      });
    });
  }
}

module.exports = BlePeripheral;
