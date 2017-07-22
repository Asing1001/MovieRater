import * as fetch from "isomorphic-fetch";
import { stringify } from 'querystring';

const ezApi = 'https://www.ezding.com.tw/ajaxfun';

export async function getAllTheaterWithSchedules(): Promise<Array<any>>  {
    const theaters = await getAllTheaters();
    return Promise.all(theaters.map(async (theater) => {
        theater.movies = await getMoviesWithSchedules(theater.id);
        return theater;
    }))
}

export async function getAllTheaters(): Promise<Array<any>> {
    const res = await fetch(`${ezApi}?func=findValidCinemas`, { method: 'POST' });
    const validCinemas = await res.json();
    return validCinemas.msg;
}

export async function getMoviesWithSchedules(cinemaId) {
    const movies = await getMoviesByCinemaId(cinemaId);
    return Promise.all(movies.map(async movie => {
        movie.showDates = await getShowDatesWithTimes(cinemaId, movie.Id);
        return movie;
    }))
}

export async function getMoviesByCinemaId(cinemaId): Promise<Array<any>> {
    const res = await fetch(`${ezApi}?func=findShowingMoviesByCinemaId&cinemaId=${cinemaId}`, { method: 'POST' });
    const movies = await res.json();
    return movies.msg;
}

export async function getShowDatesWithTimes(cinemaId, movieId) {
    const showDates = await getShowDatesByCinemaIdAndMovieId(cinemaId, movieId);
    return Promise.all(showDates.map(async showDate => {
        showDate.showTimes = await getShowTimes(cinemaId, movieId, showDate.id);
        return showDate;
    }))
}

export async function getShowDatesByCinemaIdAndMovieId(cinemaId, movieId) {
    const res = await fetch(`${ezApi}?func=findShowingShowdatesByCinemaIdAndMovieId&cinemaId=${cinemaId}&movieId=${movieId}`, { method: 'POST' });
    const showDates = await res.json();
    return showDates.msg;
}

export async function getShowTimes(cinemaId, movieId, showDate) {
    const res = await fetch(
        `${ezApi}?func=findShowingSessionsByCinemaIdAndMovieIdAndShowDate&cinemaId=${cinemaId}&movieId=${movieId}&showDate=${showDate}`, { method: 'POST' });
    const showTimes = await res.json();
    return showTimes.msg;
}