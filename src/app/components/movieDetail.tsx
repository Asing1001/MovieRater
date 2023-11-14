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
                    __html:
                      '💥《即刻救援》票房名導皮耶莫瑞爾12億打造全新動作爽片<br/>💥《玩命關頭X》《自殺突擊隊：突擊》動作巨星約翰希南領銜主演<br/>💥《GLOW：華麗女子摔角聯盟》金球獎提名愛莉森布里共同演出<br/>💥《捍衛任務4》《不可能的任務7》團隊火爆動作鉅獻<br/>💥即刻重裝上陣， 全力殺出重圍！<br/><br/>　　前特種部隊成員梅森（約翰希南 飾）為日復一日的辦公室生活感到厭煩，某天，他接到一份新工作，要在落魄的記者克萊兒（愛莉森布里 飾）前往帕多尼亞採訪統治當地的獨裁者尤安（尤安帕布羅瑞巴 飾）時擔任她的保鑣，不料，一場突如其來的軍事政變打斷了採訪，兩人必須設法逃出生天……。<br/><br/>更多資訊請見：<br/>「車庫娛樂」粉絲頁：https://www.facebook.com/garageplay.tw​<br/>「車庫娛樂」官網：https://garageplay.tw/',
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 hidden-md hidden-lg">
          <span>劇情簡介：</span>
          <div
            className={`collapsed-summary ${isExpanded ? 'expanded-summary' : ''}`} // Add or remove the 'expanded-summary' class
            dangerouslySetInnerHTML={{
              __html:
                '💥《即刻救援》票房名導皮耶莫瑞爾12億打造全新動作爽片<br/>💥《玩命關頭X》《自殺突擊隊：突擊》動作巨星約翰希南領銜主演<br/>💥《GLOW：華麗女子摔角聯盟》金球獎提名愛莉森布里共同演出<br/>💥《捍衛任務4》《不可能的任務7》團隊火爆動作鉅獻<br/>💥即刻重裝上陣， 全力殺出重圍！<br/><br/>　　前特種部隊成員梅森（約翰希南 飾）為日復一日的辦公室生活感到厭煩，某天，他接到一份新工作，要在落魄的記者克萊兒（愛莉森布里 飾）前往帕多尼亞採訪統治當地的獨裁者尤安（尤安帕布羅瑞巴 飾）時擔任她的保鑣，不料，一場突如其來的軍事政變打斷了採訪，兩人必須設法逃出生天……。<br/><br/>更多資訊請見：<br/>「車庫娛樂」粉絲頁：https://www.facebook.com/garageplay.tw​<br/>「車庫娛樂」官網：https://garageplay.tw/',
            }}
          ></div>
          {!isExpanded && (
            <button onClick={this.toggleSummary} className="readMore">
              顯示更多...
            </button>
          )}
        </div>
        {trailer && (
          <div style={{ marginTop: '.5em', float: 'left', width: '100%' }}>
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
