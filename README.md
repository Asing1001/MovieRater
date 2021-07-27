# MovieRater

[ ![Codeship Status for Asing1001/movieRater.React](https://app.codeship.com/projects/7cdda2d0-8179-0134-0e32-4ac14629b467/status?branch=master)](https://app.codeship.com/projects/182204)
[![codecov](https://codecov.io/gh/Asing1001/movieRater.React/branch/master/graph/badge.svg)](https://codecov.io/gh/Asing1001/movieRater.React)  
Crawl and merge ptt/imdb/yahoo movie data, help easy search high rating movie in Chinese and English.
![](https://asing1001.github.io/portfolio/index/movierater.jpg)

## Quick Start

`npm install -g yarn`
`yarn install`
`yarn build && yarn start` then open http://localhost:3003

## Developement

Please open two command line:  
For UI developement, server run at http://localhost:3004:

1. `yarn start`
2. `yarn webpack`

For server developement, server run at http://localhost:3003:

1. `yarn tsc:w`
2. `yarn nodemon`

## Test
`yarn test`

### Debug Test in Vscode

1. `yarn tsc:w`
2. Edit `Debug Test` section in [./.vscode/launch.json](./.vscode/launch.json), 
   for Example, if you want to debug `netflixCrawler.ts` file, modify the `args` as the following:

```json
"name": "Debug Test",
....
"args": [
    "dist/test/netflixCrawler.test.js",
    "--no-timeouts"
],
```

3. Set the breakpoint and click the `Debug Test` in Vscode `Run and Debug`
![debug test](https://user-images.githubusercontent.com/6785698/119269492-81f69000-bc2a-11eb-9660-6fd62a8e7b35.png)

## Application flow

1. Server start
2. Load data in cache, include recent movie list, all merged data
3. Start scheduler for crawl yahoo/imdb/ptt
![system diagram](https://github.com/Asing1001/system-diagrams/blob/master/mvrater.jpg?raw=true)

## Reference

The project UI is using [Material-UI](https://github.com/callemall/material-ui)
