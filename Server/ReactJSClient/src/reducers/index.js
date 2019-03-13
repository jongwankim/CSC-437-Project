import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Errs from './Errs';
import Ssns from './Ssns';
import Msgs from './Msgs';
import Invt from './Invt';
import Chkd from './Chkd';

const rootReducer = combineReducers({Prss, Cnvs, Errs, Ssns, Msgs, Invt, Chkd});

export default rootReducer;


