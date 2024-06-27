

export const initialState = null

export const reducer = (state, actions) => {
    if(actions.type === 'USER'){
        return actions.payload
    }
    if(actions.type === 'UPDATE'){
        return actions.payload
    }
    return state
}