const StreamReplayer = require('../');
const fs = require('fs')
const stream = require('stream')
const util = require('util')
const streamEqual = require('stream-equal')
const got = require('got')
const getStream = require('get-stream')

const pipeline = util.promisify(stream.pipeline)

describe('StreamReplayer', () => {
    test('file stream', async () => {
        const p = new StreamReplayer()
        const source = fs.createReadStream('index.js')
        const dist = fs.createWriteStream('/dev/null')
        await pipeline(source, p, dist)

        const result = await streamEqual(
            fs.createReadStream('index.js'),
            p.replay()
        )

        expect(result).toBe(true)
    })

    test('file stream exceeded maxBytes', async () => {
        const p = new StreamReplayer({ maxBytes: 10 })
        const source = fs.createReadStream('index.js')
        const dist = fs.createWriteStream('/dev/null')
        await expect(pipeline(source, p, dist)).rejects.toThrow('Stream exceeded specified max of 10 bytes.')
    })

    test('file stream exceeded default maxBytes', async () => {
        const p = new StreamReplayer()
        const source = fs.createReadStream('test/10M')
        const dist = fs.createWriteStream('/dev/null')
        await expect(pipeline(source, p, dist)).rejects.toThrow('Stream exceeded specified max of 10485760 bytes.')
    })

    test('http response stream', async () => {
        const p = new StreamReplayer()
        const result = await getStream(got.stream('http://www.qq.com').pipe(p))

        const replayResult = await getStream(p.replay())

        expect(result).toBe(replayResult)
})
});
