const noble = require('noble');
const chalk = require('chalk');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log(chalk.bold.blue(peripheral.advertisement.localName));

  console.log(`  Peripheral Id:        ${chalk.blueBright(peripheral.id)}`);
  console.log(`  Address/Type:         ${chalk.blueBright(peripheral.address +  ', ' + peripheral.addressType)}`);
  console.log(`  Local Name:           ${chalk.blueBright(peripheral.advertisement.localName)}`);
  console.log(`  Advertised Services:  ${chalk.blueBright(JSON.stringify(peripheral.advertisement.serviceUuids))}`);
  console.log(`  RSSI:                 ${chalk.blueBright(peripheral.rssi)}`);
  console.log(`  Connectable:          ${chalk.blueBright(peripheral.connectable)}`);

  if (peripheral.advertisement.txPowerLevel !== undefined) {
    console.log(`  TX power level:       ${chalk.blueBright(peripheral.advertisement.txPowerLevel)}`);
  }

  let serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    console.log(`  Service Data:`);
    serviceData.forEach(s => {
      console.log(`    ${chalk.green(JSON.stringify(s.uuid)) + ': ' + chalk.cyan(JSON.stringify(s.data.toString('hex')))}`);
    });
  }
  if (peripheral.advertisement.manufacturerData) {
    console.log(`  Manufacturer Data:    ${chalk.blueBright(JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')))}`);
  }

  console.log(chalk.gray("=".padStart(100, '=')));
});
