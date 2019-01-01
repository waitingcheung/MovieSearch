# MovieSearch

A full-text search engine for movie plots based on Elasticsearch and Docker.

![](https://user-images.githubusercontent.com/2617118/50572357-e0bcd400-0df9-11e9-9aeb-542172424f71.gif)

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
