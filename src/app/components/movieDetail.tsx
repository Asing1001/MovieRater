import * as React from 'react';
import SVGSocialShare from 'material-ui/svg-icons/social/share';
import IconButton from 'material-ui/IconButton';
import Movie from '../../models/movie';
import Ratings from './ratings';
import { getMovieSchema } from '../helper';
import HLSVideoPlayer from './HLSVideoPlayer';

interface MovieDetailProps {
  movie: Movie;
}

function getBigPosterUrl(linePosterUrl: string): string {
  if (!linePosterUrl) {
    return '';
  }
  return linePosterUrl.replace('/w280', '/w644');
}
class MovieDetail extends React.PureComponent<MovieDetailProps, { isExpanded: boolean }> {
  constructor(props: MovieDetailProps) {
    super(props);
    this.state = {
      isExpanded: false, // Initially, the summary is not expanded
    };
  }

  share = () => {
    navigator['share']({
      title: document.title,
      text: `${this.props.movie.chineseTitle} ${this.props.movie.englishTitle} | ${document['meta'].description} | MovieRater`,
      url: location.href,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  };

  toggleSummary = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  renderDetail = () => {
    const { isExpanded } = this.state;
    const { movie } = this.props;
    const schema = JSON.stringify(getMovieSchema(movie));
    const trailer = getLINETrailerDetail(movie.lineTrailerHash);

    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }}></script>
        <div>
          <img src={getBigPosterUrl(movie.posterUrl)} className="col-xs-4 movieImage" alt="" />
          <div className="col-xs-8">
            <Ratings className="ratings" movie={movie}>
              {navigator['share'] && (
                <IconButton
                  style={{ position: 'absolute', top: '3px', right: 8 }}
                  onTouchTap={(e) => {
                    e.preventDefault();
                    this.share();
                  }}
                >
                  <SVGSocialShare color={'#9E9E9E'} />
                </IconButton>
              )}
            </Ratings>
            <div className="movieDetail">
              <div>
                <span>中文名稱：</span>
                <span>{movie.chineseTitle}</span>
              </div>
              <div>
                <span>英文名稱：</span>
                <span>{movie.englishTitle}</span>
              </div>
              <div>
                <span>上映日期：</span>
                <span>{movie.releaseDate}</span>
              </div>
              <div>
                <span>類型：</span>
                <span>{movie.types.join('、')}</span>
              </div>
              <div>
                <span>片長：</span>
                <span>{movie.runTime}分鐘</span>
              </div>
              <div>
                <span>導演：</span>
                <span>{movie.directors.join('、')}</span>
              </div>
              <div>
                <span>演員：</span>
                <span>{movie.actors.join('、')}</span>
              </div>
              <div className="visible-md visible-lg">
                <span>劇情簡介：</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: movie.summary,
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 hidden-md hidden-lg">
          <h5>劇情簡介：</h5>
          <div
            className={`collapsed-summary ${isExpanded ? 'expanded-summary' : ''}`} // Add or remove the 'expanded-summary' class
            dangerouslySetInnerHTML={{
              __html: movie.summary,
            }}
          ></div>
          {!isExpanded && (
            <button onClick={this.toggleSummary} className="readMore">
              顯示更多...
            </button>
          )}
        </div>
        {trailer && (
          <div style={{ padding: '.5em', float: 'left', width: '100%' }}>
            <h5>預告片：</h5>
            <HLSVideoPlayer streamUrl={trailer.streamUrl} poster={trailer.poster} />
          </div>
        )}
      </div>
    );
  };

  render() {
    return this.renderDetail();
  }
}

export default MovieDetail;
function getLINETrailerDetail(lineTrailerHash: string) {
  if (!lineTrailerHash) {
    return null;
  }
  return {
    streamUrl: `https://obs.line-scdn.net/${lineTrailerHash}/480p.m3u8`,
    poster: `https://obs.line-scdn.net/${lineTrailerHash}/w644`,
  };
}
