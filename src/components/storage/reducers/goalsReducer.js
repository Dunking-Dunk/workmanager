
const initalState = {
    allCategory: [],
    allGoals: {}
}

const GoalReducer = (state = initalState, action) => {
    switch (action.type) {
        case 'ALL_CATEGORY':
            return {
                ...state,
                allCategory: action.data
            }
        case 'ALL_GOALS':
            return {
                ...state,
                
                allGoals: { ...state.allGoals, [action.category]: action.data }
            }
        default:
            return state
    }
}

export default GoalReducer