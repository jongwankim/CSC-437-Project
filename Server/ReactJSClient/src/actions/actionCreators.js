import * as api from '../api';

export function clearErrs() {
   return (dispatch, prevState) => {
      dispatch({type: "REMOVE_ERRS"});
   };
}

export function signIn(credentials, cb, errorcb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
       .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
       .then(() => {if (cb) cb();})
       .catch(error => {
         dispatch({type: 'LOGIN_ERR', details: error});
         if (errorcb) errorcb();
       });
   };
}

export function upload(file, name) {
   return (dispatch, prevState) => {
      api.upload(file, name);
   }
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
       .then(() => dispatch({ type: 'SIGN_OUT' }))
       .then(() => {if (cb) cb();})
       .catch(error => {
         dispatch({type: 'LOGIN_ERR', details: error});
       });
   };
}

export function register(data, cb, errorcb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
       .then((userInfo) => {
         dispatch({type: "REGISTER", user: userInfo})})
       .then(() => {if (cb) cb();})
       .catch(error => {
         dispatch({type: 'REGISTER_ERR', details: error});
         if (errorcb) errorcb();
      });
   };
}

export function getInvt(cb) {
   return (dispatch, prevState) => {
      api.getInvt()
       .then(invt => dispatch({type: 'GET_ALL_INVT', invt: invt}))
       .catch(error => {
         console.log("ERROR IN GET INVT");
         dispatch({type: 'LOGIN_ERR', details: error});
       });
   }
}

export function addInvt(item, file, cb) {
   return (dispatch, prevState) => {
      api.addInvt(item)
       .then(res => {
         var blob = file.slice(0, file.size, 'image/png');
         var newFile = new File([blob], res.headers.get('Location').split('/')[2] + '.png', {type: 'image/png'});
         var fileForm = new FormData();
         fileForm.append('file', newFile);
         upload(fileForm, 
            res.headers.get('Location').split('/')[2])(dispatch, prevState);
       } )
       .then(() => getInvt(cb)(dispatch, prevState))
       .catch(error => {
         console.log("ERROR IN ADD INVT ", error);
         dispatch({type: 'LOGIN_ERR', details: error});
       })
   }
}

export function delInvt(id, cb) {
   return (dispatch, prevState) => {
      api.delInvt(id)
       .then(() => dispatch({type: 'DEL_INVT', id: id}))
       .then(() => {if (cb) cb();})
       .catch(error => {
         console.log("ERROR IN DEL INVT");
         dispatch({type: 'LOGIN_ERR', details: error});
      });
   }
}

export function updateQuantity(id, q, cb) {
   return (dispatch, prevState) => {
      api.updateQuantity(id, q)
       .then((invt) => dispatch({type: 'GET_ALL_INVT', invt: invt}))
       .then(() => {if (cb) cb();})
       .catch(error => {
         console.log("ERROR IN UPDATE QUANTITY");
         dispatch({type: 'LOGIN_ERR', details: error});
      });
   }
}

export function getChkd(cb) {
   return (dispatch, prevState) => {
      api.getChkd()
       .then(chkd => {
         return dispatch({type: 'GET_ALL_CHKD', chkd: chkd})})
       .catch(error => {
         console.log("ERROR IN GET CHKD", error);
         dispatch({type: 'LOGIN_ERR', details: error});
      });
   }
}

export function addChkd(info, id, cb) {
   return (dispatch, prevState) => {
      api.addChkd(info, id)
       .then((res) => dispatch({type: 'ADD_CHKD', chkd: res}))
       .then(() => {if (cb) cb();})
       .catch(error => {
         console.log("ERROR IN DEL INVT: ", error);
         dispatch({type: 'LOGIN_ERR', details: error});
      });
   }
}

export function delChkd(chkdId, itemId, oldQuantity, cb) {
   return (dispatch, prevState) => {
      api.delChkd(chkdId)
       .then(res => {
         updateQuantity(itemId, oldQuantity + 1, cb)(dispatch, prevState)
       })
   }
}
