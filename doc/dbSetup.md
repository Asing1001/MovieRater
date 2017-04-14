# Create index
To speed up db query, we need to create index
1. yahooMovies : yahooId: -1
2. pttArticles : url: -1

### Sample command
```
db.runCommand({
  "createIndexes": "pttArticles",
  "indexes": [
    {
      "key": {
        "url": -1
      },
      "name": "url"
    }
  ]
})
```