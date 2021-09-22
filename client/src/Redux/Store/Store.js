import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from "../Reducers/RootReducer"

export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (e) {
      return undefined;
    }
  };
  
export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (e) {
      return
    }
  };
  

const persistedState = loadState()

const store = createStore(reducer, persistedState, applyMiddleware(thunk)); 

export default store;