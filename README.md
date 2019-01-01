# MovieSearch

A full-text search engine for movie plots based on Elasticsearch and Docker.

![ezgif-5-158b7e3daf98](https://user-images.githubusercontent.com/2617118/50572365-50cb5a00-0dfa-11e9-951e-12a124888819.gif)


## Installation

```sh
# Build the docker containers
docker-compose up -d --build

# Load the movie plots to the Elasticsearch database
docker exec gs-api "node" "server/load_data.js"
```

## Usage
Open ``localhost:8080`` in the browser.

## References

- [Building a Full-Text Search App Using Docker and Elasticsearch](https://blog.patricktriest.com/text-search-docker-elasticsearch/)
