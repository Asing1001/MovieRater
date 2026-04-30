import Movie from '@/models/movie';

export default function Ratings({ movie, className }: { movie: Movie; className?: string }) {
  const g = movie.goodRateArticles?.length ?? 0;
  const n = movie.normalRateArticles?.length ?? 0;
  const b = movie.badRateArticles?.length ?? 0;

  return (
    <div className={className} style={{ paddingTop: '1em', paddingBottom: '1em', paddingLeft: 8 }}>
      <div className="ratingWrapper">
        <span className="logo imdb">IMDb</span>
        {movie.imdbID ? (
          <a href={`https://www.imdb.com/title/${movie.imdbID}`}>{movie.imdbRating || 'N/A'}</a>
        ) : (
          <span>{movie.imdbRating || 'N/A'}</span>
        )}
      </div>

      {movie.lineRating ? (
        <div className="ratingWrapper">
          <span className="logo line">LINE</span>
          <a href={`https://today.line.me/tw/v2/movie/${movie.lineUrlHash}/2`}>{movie.lineRating || 'N/A'}</a>
        </div>
      ) : (
        <div className="ratingWrapper">
          <span className="logo yahoo">Y!</span>
          <a href={`https://movies.yahoo.com.tw/movieinfo_main.html/id=${movie.yahooId}`}>
            {movie.yahooRating || 'N/A'}
          </a>
        </div>
      )}

      <div className="ratingWrapper">
        <span className="logo ptt">PTT</span>
        <span title="好雷/普雷/負雷">{g}/{n}/{b}</span>
      </div>
    </div>
  );
}
