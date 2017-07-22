"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("isomorphic-fetch");
const ezApi = 'https://www.ezding.com.tw/ajaxfun';
function getAllTheaterWithSchedules() {
    return __awaiter(this, void 0, void 0, function* () {
        const theaters = yield getAllTheaters();
        return Promise.all(theaters.map((theater) => __awaiter(this, void 0, void 0, function* () {
            theater.movies = yield getMoviesWithSchedules(theater.id);
            return theater;
        })));
    });
}
exports.getAllTheaterWithSchedules = getAllTheaterWithSchedules;
function getAllTheaters() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${ezApi}?func=findValidCinemas`, { method: 'POST' });
        const validCinemas = yield res.json();
        return validCinemas.msg;
    });
}
exports.getAllTheaters = getAllTheaters;
function getMoviesWithSchedules(cinemaId) {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield getMoviesByCinemaId(cinemaId);
        return Promise.all(movies.map((movie) => __awaiter(this, void 0, void 0, function* () {
            movie.showDates = yield getShowDatesWithTimes(cinemaId, movie.Id);
            return movie;
        })));
    });
}
exports.getMoviesWithSchedules = getMoviesWithSchedules;
function getMoviesByCinemaId(cinemaId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${ezApi}?func=findShowingMoviesByCinemaId&cinemaId=${cinemaId}`, { method: 'POST' });
        const movies = yield res.json();
        return movies.msg;
    });
}
exports.getMoviesByCinemaId = getMoviesByCinemaId;
function getShowDatesWithTimes(cinemaId, movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const showDates = yield getShowDatesByCinemaIdAndMovieId(cinemaId, movieId);
        return Promise.all(showDates.map((showDate) => __awaiter(this, void 0, void 0, function* () {
            showDate.showTimes = yield getShowTimes(cinemaId, movieId, showDate.id);
            return showDate;
        })));
    });
}
exports.getShowDatesWithTimes = getShowDatesWithTimes;
function getShowDatesByCinemaIdAndMovieId(cinemaId, movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${ezApi}?func=findShowingShowdatesByCinemaIdAndMovieId&cinemaId=${cinemaId}&movieId=${movieId}`, { method: 'POST' });
        const showDates = yield res.json();
        return showDates.msg;
    });
}
exports.getShowDatesByCinemaIdAndMovieId = getShowDatesByCinemaIdAndMovieId;
function getShowTimes(cinemaId, movieId, showDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${ezApi}?func=findShowingSessionsByCinemaIdAndMovieIdAndShowDate&cinemaId=${cinemaId}&movieId=${movieId}&showDate=${showDate}`, { method: 'POST' });
        const showTimes = yield res.json();
        return showTimes.msg;
    });
}
exports.getShowTimes = getShowTimes;
//# sourceMappingURL=ezCrawler.js.map