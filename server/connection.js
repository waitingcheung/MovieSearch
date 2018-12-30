const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const index = 'library'
const type = 'novel'
const port = 9200
const host = process.env.ES_HOST || 'localhost'
const client = new elasticsearch.Client({ host: { host, port } })

/** Check the ES connection status */
async function checkConnection() {
    let isConnected = false
    while (!isConnected) {
        console.log('Connecting to ES')
        try {
            const health = await client.cluster.health({})
            console.log(health)
            isConnected = true
        } catch (err) {
            console.log('Connection Failed, Retrying...', err)
        }
    }
}

/** Clear the index, recreate it, and add mappings */
async function resetIndex() {
    if (await client.indices.exists({ index })) {
        await client.indices.delete({ index })
    }

    await client.indices.create({ index })
    await putMovieMapping()
}

/** Add movie section schema mapping to ES */
async function putMovieMapping() {
    const schema = {
        year: { type: 'date' },
        title: { type: 'keyword' },
        origin: { type: 'keyword' },
        director: { type: 'keyword' },
        cast: { type: 'keyword' },
        genre: { type: 'keyword' },
        url: { type: 'text' },
        location: { type: 'integer' },
        plot: { type: 'text' }
    }

    return client.indices.putMapping({ index, type, body: { properties: schema } })
}

module.exports = {
    client,
    index,
    type,
    checkConnection,
    resetIndex
}