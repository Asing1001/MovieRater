# MovieRater 
[ ![Codeship Status for Asing1001/movieRater.React](https://app.codeship.com/projects/7cdda2d0-8179-0134-0e32-4ac14629b467/status?branch=master)](https://app.codeship.com/projects/182204)
[![codecov](https://codecov.io/gh/Asing1001/movieRater.React/branch/master/graph/badge.svg)](https://codecov.io/gh/Asing1001/movieRater.React)  
Crawl and merge ptt/imdb/yahoo movie data, help easy search high rating movie in Chinese and English.
![](https://asing1001.github.io/portfolio/index/movierater.jpg)

## Quick Start 
`npm install && npm run build && npm start` then open http://localhost:3003

## Developement
Please open two command line:  
For UI developement, server run at http://localhost:3004:
1. `npm start`
2. `npm run webpack`

For server developement, server run at http://localhost:3003:
1. `npm run tsc:w`
2. `npm run nodemon`

## Test
`npm run test`

## Application flow
1. Server start
2. Load data in cache, include recent movie list, all merged data
3. Start scheduler for crawl yahoo/imdb/ptt
![](https://github.com/Asing1001/system-diagrams/blob/master/mvrater.jpg?raw=true)

## Reference
The project UI is using [Material-UI](https://github.com/callemall/material-ui)
