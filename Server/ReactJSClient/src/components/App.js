/**
 * The App component wraps the Main component and the Redux library
 * to bind the action creators and datastore to properties in the component
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main/Main';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo)

// These are the properties we'll automatically pass to Main
function mapStateToProps(state) {
   console.log("State is " + JSON.stringify(state));
   return {
      Prss: state.Prss,
      Cnvs: state.Cnvs,
      Errs: state.Errs,
      Ssns: state.Ssns,
      Msgs: state.Msgs,
      Invt: state.Invt
   };
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators(actionCreators, dispatch);
}

const App = withRouter(connect(
   mapStateToProps,
   mapDispatchToProps
)(Main));

export default App;
