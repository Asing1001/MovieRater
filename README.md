# MovieRater

[![GitHub Actions status](https://github.com/Asing1001/movieRater.React/actions/workflows/build.yml/badge.svg)](https://github.com/Asing1001/movieRater.React/actions)
[![codecov](https://codecov.io/gh/Asing1001/movieRater.React/branch/master/graph/badge.svg)](https://codecov.io/gh/Asing1001/movieRater.React)  
Crawl and merge ptt/imdb/yahoo movie data, help easy search high rating movie in Chinese and English.
![](https://asing1001.github.io/portfolio/index/movierater.jpg)

## Quick Start

- `nvm use`
- `npm install -g yarn`
- `docker compose up`
- `yarn`
- `yarn build && yarn start` then open http://localhost:3003

## Get the latest Data locally

0. `yarn setup`
1. `yarn mergedata`

## Developement

Please open three command line:  
For UI developement, server run at http://localhost:3004:

0. `docker compose up`
1. `yarn start`
2. `yarn webpack`

For server developement, server run at http://localhost:3003:

0. `docker compose up`
1. `yarn tsc:w`
2. `TZ=Asia/Taipei yarn nodemon`

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

## Crawler

- To manually run a single crawler you could reference firstTimeSetup.ts, and run `yarn setup`  

## Reference

The project UI is using [Material-UI](https://github.com/callemall/material-ui)

## Deployment

### Terraform

```bash
gcloud auth application-default login
cd terraform
terraform init
terraform plan
```

### Heroku

It is automatically built and deploy on heroku.
