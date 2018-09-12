/*
  Continously scans for peripherals and prints out message when they enter/exit
    In range criteria:      RSSI < threshold
    Out of range criteria:  lastSeen > grace period
  based on code provided by: Mattias Ask (http://www.dittlof.com)
*/
const noble = require('noble');
const chalk = require('chalk');

const PERIPHERAL_ID_OR_NAME = process.argv[2];

const RSSI_THRESHOLD = -90;
const EXIT_GRACE_PERIOD = 2000; // milliseconds

let lastSeen;

console.log(`Searching '${chalk.red(PERIPHERAL_ID_OR_NAME)}' ...`);

noble.on('discover', function (peripheral) {
  if (peripheral.rssi < RSSI_THRESHOLD) {
    // ignore
    return;
  }

  if (!(peripheral.id === PERIPHERAL_ID_OR_NAME || peripheral.address === PERIPHERAL_ID_OR_NAME || peripheral.advertisement.localName === PERIPHERAL_ID_OR_NAME)) {
    return;
  }

  noble.stopScanning();
  console.log(` RSSI: ${chalk.cyan(peripheral.rssi)}, ${chalk.blue('ENTERED')}`);
  lastSeen = Date.now();
  watch(peripheral);
});

function watch(peripheral) {
  peripheral.connect(() => {
    setInterval(() => {
      if (lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {
        peripheral.updateRssi((err, rssi) => {
          console.log(` RSSI: ${chalk.cyan(rssi)}, ${chalk.blue(rssi < RSSI_THRESHOLD ? chalk.red('EXITED') : chalk.green('IN RANGE'))}`);
        });
      }
    }, EXIT_GRACE_PERIOD / 2);
  });
}

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});
