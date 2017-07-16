import * as fetch from "isomorphic-fetch";

const ezApi = 'https://www.ezding.com.tw/ajaxfun';
export async function getAllTheaters() {
    const res = await fetch(`${ezApi}?func=findValidCinemas`, { method: 'POST' });
    const validCinemas = await res.json();
    return validCinemas.msg;
}

export async function getMoviesByCinemaId(cinemaId) {
    const res = await fetch(`${ezApi}?func=findShowingMoviesByCinemaId&cinemaId=${cinemaId}`, { method: 'POST' });
    const movies = await res.json();
    return movies.msg;
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