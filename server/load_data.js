const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const esConnection = require('./connection')

/** Clear ES index, parse and index all files from the movies directory */
async function readAndInsertMovies() {
    try {
        // Clear previous ES index
        await esConnection.resetIndex()

        const output = []
        // Create the parser
        const parser = parse({
            columns: true,
            delimiter: ','
        })

        // Use the readable stream api
        parser.on('readable', async function() {
            let record
            while (record = parser.read()) {
                output.push(record)
                await insertMovieData(record)
            }
        })

        // Catch any error
        parser.on('error', function(err) {
            console.error(err.message)
        })

        // End of parsing
        parser.on('end', function() {})

        const moviePlots = path.join('movies', 'wiki_movie_plots_deduped.csv');
        fs.createReadStream(moviePlots).pipe(parser)

    } catch (err) {
        console.error(err)
    }
}

/** Bulk index the movie data in Elasticsearch */
async function insertMovieData(movie) {

    let bulkOps = [] // Array to store bulk operations

    const plot = movie['Plot']

    // Clean movie plot and split into array of paragraphs
    const paragraphs = plot
        .split(/\n\s+\n/g) // Split each paragraph into it's own array entry
        .map(line => line.replace(/\r\n/g, ' ').trim()) // Remove paragraph line breaks and whitespace
        .map(line => line.replace(/_/g, '')) // Guttenberg uses "_" to signify italics.  We'll remove it, since it makes the raw text look messy.
        .filter((line) => (line && line !== '')) // Remove empty lines

    // console.log(`Parsed ${paragraphs.length} Paragraphs\n`)

    const year = movie['Release Year']
    const title = movie['Title']
    const origin = movie['Origin/Ethnicity']
    const director = movie['Director']
    const cast = movie['Cast']
    const genre = movie['Genre']
    const url = movie['Wiki Page']

    console.log('Reading Movie - %s (%i) By %s', title, year, cast)


    // Add an index operation for each section in the movie
    for (let i = 0; i < paragraphs.length; i++) {
        // Describe action
        bulkOps.push({ index: { _index: esConnection.index, _type: esConnection.type } })

        // Add document
        bulkOps.push({
            year,
            title,
            origin,
            director,
            cast,
            genre,
            url,
            location: i,
            text: paragraphs[i]
        })
    }

    await esConnection.client.bulk({ body: bulkOps })
}

readAndInsertMovies()