# Carousel

3D Carousel of cover books with infinite loop. Carousel is using a async generator for fetching new content, all components are WebComponents. Images are cached between searches so if user search the same query images are restored from cache.

![](screen1.png)

## Prerequisites:

[NodeJS v12.2.0](https://nodejs.org/en/)

## Installation

```sh
npm install
```

Running development server:

```sh
npm run start:dev
```

Open webrowser on [localhost:8080](localhost:8080)

## Using

Type some keywords of a book/s you want to search for i.e. "Lord of the rings"

## TODO:

- Error handling
- Add busy spinner indicator
- Give buttons batter look
- Try use flex instead of media
- Fix 3D Transform for ios devices
- Add polyfill for older borwsers that aren't sporrting the webcomopnents.
- Optional: Implement search by voice
- Optiona: Cache size handling
