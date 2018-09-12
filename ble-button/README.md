# BLE Button

## `clicker.js`

Change following attributes. 

```js
// required one of the following (LOCAL_NAME or PERIPHERAL_ID or PERIPHERAL_ADDRESS)
const LOCAL_NAME = "O-Click";
const PERIPHERAL_ID = "f61f624914da4314a3a0b4afb962aea2";
const PERIPHERAL_ADDRESS = "d0:39:72:d6:0d:47";

// both required to listen to click event
const SERVICE_UUID = "ffe0";
const CHARACTERISTIC_UUID = 'f000ffe104514000b000000000000000';
```
