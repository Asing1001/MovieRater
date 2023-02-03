import * as fetch from "isomorphic-fetch";
import * as cheerio from "cheerio";
import Movie from '../models/movie';
import * as moment from 'moment';
import * as https from 'https';
import { IncomingHttpHeaders } from "http2";

interface IMDB {
    imdbID: string
    imdbRating: string
}

export async function getIMDBMovieInfo(movie: Movie): Promise<IMDB> {
    try {
        const imdbID = await getIMDBSuggestId(movie);
        if (!imdbID) {
            return null
        }

        const imdbRating = await getIMDBRating(imdbID);
        return {
            imdbID,
            imdbRating
        }
    }
    catch (e) {
        console.error(e);
        return null
    }
}

async function getIMDBSuggestId({ englishTitle, releaseDate }: Movie) {
    const imdbSuggestJsonUrl = getIMDBSuggestJsonUrl(englishTitle);
    console.log(imdbSuggestJsonUrl)
    const response = await fetch(imdbSuggestJsonUrl);
    const suggestions = await response.json();
    if (suggestions && suggestions.d && suggestions.d.length) {
        const releaseYear = moment(releaseDate).year()
        const correctMovie = suggestions.d.find(({ y: year, l: title }) => {
          const similarity =  getSimilarity(title, englishTitle)
          return similarity > 0.8 || (similarity > 0.6 && year === releaseYear)
        })

        if (correctMovie && correctMovie.id) {
            return correctMovie.id
        }
    }
    console.log(`could not find suggest id at ${imdbSuggestJsonUrl}`);
    return null;
}

// For example, the suggestionUrl of the movie "girl's revenge" is https://v2.sg.media-imdb.com/suggestion/g/girls_revenge.json
function getIMDBSuggestJsonUrl(englishTitle: string) {
    const jsonName = englishTitle.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_").substr(0, 20);
    return `https://v2.sg.media-imdb.com/suggestion/${jsonName.charAt(0)}/${jsonName}.json`
}

const imdbMobileMovieUrl = 'https://m.imdb.com/title/';
export async function getIMDBRating(imdbID: string) {
    if (!imdbID) {
        return null
    }
    const targetMovieImdbUrl = `${imdbMobileMovieUrl + imdbID + '/'}`;
    let response = await httpRequest('GET', targetMovieImdbUrl);
    const html = response.body;
    const $ = cheerio.load(html);
    const rating = $('[data-testid="hero-rating-bar__aggregate-rating__score"] > span').first().text();
    return rating;
}

function getSimilarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


function httpRequest(method, url, body = null) {

  if (body && method !== 'POST') throw new Error(`Invalid use of the body parameter while using the ${method} method.`);
  
  let urlObject;
  try {
      urlObject = new URL(url);
  } catch (error) {
      throw new Error(`Invalid url ${url}`);
  }

  let options = {
      method: method,
      hostname: urlObject.hostname,
      port: urlObject.port,
      path: urlObject.pathname,
      headers: {}
  };

  return new Promise((resolve: (value: IHttpResponse) => void, reject) => {

      const clientRequest = https.request(options, incomingMessage => {

          // Response object.
          let response : IHttpResponse = {
              statusCode: incomingMessage.statusCode,
              headers: incomingMessage.headers,
              bodyStream: [],
              body: ''
          };

          // Collect response body data.
          incomingMessage.on('data', chunk => {
              return response.bodyStream.push(chunk);
          });

          // Resolve on end.
          incomingMessage.on('end', () => {
              if (response.bodyStream.length) {
                  response.body = response.bodyStream.join();
                  try {
                      response.body = JSON.parse(response.body);
                  } catch (error) {
                      // Silently fail if response is not JSON.
                  }
              }

              resolve(response);
          });
      });
      
      // Reject on request error.
      clientRequest.on('error', error => {
          reject(error);
      });

      // Write request body if present.
      if (body) {
          clientRequest.write(body);
      }

      // Close HTTP connection.
      clientRequest.end();
  });
}

export interface IHttpResponse
{
  statusCode: number,
  headers: IncomingHttpHeaders
  bodyStream: any[],
  body: string,
}