export default function Invt(state = [], action) {

   switch (action.type) {
      case 'GET_ALL_INVT':
         return action.invt;
      case 'ADD_INVT':
         return state.concat([action.item]);
      case 'DEL_INVT':
         return state.filter(item => item.id !== action.id);
      default:
         return state;
   }
}
