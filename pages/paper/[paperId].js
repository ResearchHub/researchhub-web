import Link from 'next/link';
import Router, { withRouter } from 'next/router';

import { StyleSheet, css } from 'aphrodite';

class Paper extends React.Component {
  render() {
    let { query } = this.props.router
    return (
        <div className="hero">
          Paper Id: {query.paperId}
        </div>
    )
  }
}

var styles = StyleSheet.create({

})

export default withRouter(Paper);
