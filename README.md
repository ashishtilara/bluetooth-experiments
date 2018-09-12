## EddyStone Beacon - Raspberry PI

## iBeacon - Raspberry PI

**Reference**: https://www.skyrise.tech/blog/tech/bluetooth-raspberry-pi-bleno-part-1-ibeacon/

**Author**: Marcin Budny

In this short series of blog posts I would like to demonstrate how easy it is to create a Bluetooth peripheral device with bleno library by Sandeep Mistry.

Working directly with BlueZ, the Linux Bluetooth protocol stack, can be overwhelming. The learning curve is steep and prohibitive, especially when all you want to do is to spike new technology. Fortunately, bleno provides a very nice node.js wrapper on top of BlueZ, allowing you to work with Bluetooth 4.0+ and GATT protocol. bleno allows you to implement a peripheral device (think: a sensor you connect to to get some data). If you are interested in implementing a central role (think: a smartphone), there is another library called noble.

In this first post my goal is to demonstrate how to setup bleno on your Pi (or any Linux machine for that matter). We’re not going dig into GATT just yet. We’ll create a simple app that broadcasts as an iBeacon. iBeacon is a protocol on top of Bluetooth 4.0 that makes it possible for a device to broadcast its identifiers to nearby receivers.

### Prepare development environment

You’ll need a Linux machine with a Bluetooth 4.0+ adapter. This can be a Raspberry Pi 3 with integrated Bluetooth module, or a laptop running Linux (with Bluetooth built-in or added as a USB dongle).

You can verify available Bluetooth adapters with:

```
hciconfig
```

bleno will use hci0 by default. If you want to use another adapter, specify it with an environment variable:

```
export NOBLE_HCI_DEVICE_ID=1 # uses hci1
```

As a prerequisite, you’ll also need node.js and npm installed and able to build native modules. You’ll also need following libraries:

```
sudo apt install bluetooth bluez libbluetooth-dev libudev-dev
```

The bluetooth system service needs to be disabled for bleno to work, otherwise some operations will just fail silently. This is quite easy to miss.

```
sudo service bluetooth stop
sudo hciconfig hci0 up # reactivate hci0 or another hciX you want to use
```

### The beacon app
Bleno lets you create an iBeacon app in just a few lines of code:

```
npm install bleno --save
```

```
const bleno = require("bleno");
const UUID = "12345678-1234-1234-1234-1234-123456123456"; // set your own value
const MINOR = 2; // set your own value
const MAJOR = 1; // set your own value
const TX_POWER = -60; // just declare transmit power in dBm
console.log("Starting bleno...");
bleno.on("stateChange", state => {
    if (state === 'poweredOn') {
        console.log("Starting broadcast...");
        bleno.startAdvertisingIBeacon(UUID, MAJOR, MINOR, TX_POWER, err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${UUID}, major: ${MAJOR}, minor: ${MINOR}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});
```

You always need to handle the stateChangeevent so that you only start using other bleno functionality, once the Bluetooth adapter has been properly initialized. The broadcast itself is started with single method call. The tx power param does not actually change the power of the transmission. It is declared and used by receivers to estimate the range from the beacon. Run the application (see bleno docs if you want to skip sudo).

```
sudo node app.js
```
