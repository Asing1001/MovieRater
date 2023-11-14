import * as React from 'react';
import * as Hls from 'hls.js';

class HLSVideoPlayer extends React.Component<{ streamUrl: string; poster: string }, {}> {
  videoRef = null;
  hls = null;

  componentDidMount() {
    this.initPlayer();
  }

  componentDidUpdate(prevProps) {
    if (this.props.streamUrl !== prevProps.streamUrl) {
      this.initPlayer();
    }
  }

  componentWillUnmount() {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  initPlayer() {
    if (Hls.isSupported()) {
      const video = this.videoRef;
      this.hls = new Hls();
      this.hls.loadSource(this.props.streamUrl);
      this.hls.attachMedia(video);
    }
  }

  render() {
    return (
      <video
        ref={(element) => {
          this.videoRef = element;
        }}
        poster={this.props.poster}
        controls
        width={'100%'}
      />
    );
  }
}

export default HLSVideoPlayer;
