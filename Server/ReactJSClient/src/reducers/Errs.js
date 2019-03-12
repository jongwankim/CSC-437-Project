function Errs(state = {}, action) {
	switch(action.type) {
		case 'LOGIN_ERR':
			return action.details;
		case 'REGISTER_ERR':
			return action.details;
		case 'TYPE_ERR':
			return action.details;
		case 'REMOVE_ERRS':
			return {};
		default:
			return {};
	}
}

export default Errs;