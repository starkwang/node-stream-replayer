# node-stream-replayer
Record a stream and replay it.

## Install

```bash
npm install --save stream-replayer
```

## Usage

```js
const fs = require('fs')
const StreamReplayer = require('stream-replayer')

const replayer = new StreamReplayer()

// Pipe file A to file B and record the stream
fs.createReadStream('A')
  .pipe(replayer)
  .pipe(fs.createWriteStream('B'))

// Replay the stream to file C
replayer.play().pipe(fs.createWriteStream('C'))
```

## options

### maxBytes

The max bytes for replayer to record. Default: `10MB`

```js
const replayer = new StreamReplayer({
  maxBytes: 10 * 1024 // set max bytes to 10KB
})
```
