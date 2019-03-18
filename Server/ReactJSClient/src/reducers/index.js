import { combineReducers } from 'redux';

import Prss from './Prss';
import Errs from './Errs';
import Ssns from './Ssns';
import Invt from './Invt';
import Chkd from './Chkd';

const rootReducer = combineReducers({Prss, Errs, Ssns, Invt, Chkd});

export default rootReducer;


