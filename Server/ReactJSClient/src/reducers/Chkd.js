export default function Chkd(state = [], action) {
   switch (action.type) {
      case 'GET_ALL_CHKD':
         return action.chkd;
      case 'ADD_CHKD':
         return state.concat([action.chkd]);
      case 'DEL_CHKD':
         return state.filter(chkd => chkd.id !== action.id);
      default:
         return state;
   }
}
