export default function Msgs(state = [], action) {

   switch (action.type) {
      case 'FILL_MSGS':
         return action.msgs;
      case 'ADD_MSG':
         return state.concat([action.msgs]);
      case 'SIGN_OUT':
         return [];
      default:
         return state;
   }
}
