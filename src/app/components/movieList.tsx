import * as React from 'react';
import FindResult from './findResult';
import Movie from '../../models/movie';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class MovieList extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
    };
  }
  handleChange = (event, index, value) => this.setState({ value });
  render() {
    return (
      <div>
        {
        //   <SelectField
        //   value={this.state.value}
        //   onChange={this.handleChange}
        //   >
        //   <MenuItem value={1} primaryText="上映日期" />
        //   <MenuItem value={2} primaryText="IMDB" />
        //   <MenuItem value={3} primaryText="Yahoo" />
        //   <MenuItem value={4} primaryText="爛番茄" />
        //   <MenuItem value={5} primaryText="Ptt" />
        // </SelectField>
        }
        {
          this.props.movies.map((movie: Movie) => (
            <FindResult key={movie.yahooId} movie={movie} showDetail={this.props.showDetail.bind(this)}></FindResult>
          ))
        }
      </div>
    );
  }
}
export default MovieList;