import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
    value: number;
};

const initialState = {
    value: 0,
} as CounterState;

export const counter = createSlice({
    name: "counter",
    initialState,
    reducers: {
        reset: () => initialState,
        increment: (state) => {
            state.value += 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

export const {
    increment,
    incrementByAmount,
} = counter.actions;
export default counter.reducer;
