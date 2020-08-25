const { Transform } = require('stream')
const toReadableStream = require('to-readable-stream')

class StreamReplayer extends Transform {
    constructor(options) {
        super()
        this.maxBytes = (options && options.maxBytes) || 10 * 1024 * 1024
        this._store = Buffer.alloc(0)
    }

    _transform(chunk, encoding, cb) {
        if (this._store.length + chunk.length > this.maxBytes) {
            return cb(new Error("Stream exceeded specified max of " + this.maxBytes + " bytes."))
        }
        this._store = Buffer.concat([this._store, chunk])
        return cb(null, chunk)
    }

    replay() {
        return toReadableStream(this._store)
    }
}

module.exports = StreamReplayer