function Ssns(state = {}, action) {
	switch(action.type) {
		case 'REGISTER':
			return {
				...state,
				user: action.user.status
			}
		default:
			return state;
	}
}

export default Ssns;