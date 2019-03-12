import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Errs from './Errs';
import Ssns from './Ssns';
import Msgs from './Msgs';
import Invt from './Invt';

const rootReducer = combineReducers({Prss, Cnvs, Errs, Ssns, Msgs, Invt});

export default rootReducer;


