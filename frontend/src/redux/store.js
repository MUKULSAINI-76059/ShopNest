import {configureStore} from "@reduxjs/toolkit"
import cardReducer from "./cartSlice.js"

const store = configureStore({
    reducer:{
        cart: cardReducer,
    },
});

export default store;