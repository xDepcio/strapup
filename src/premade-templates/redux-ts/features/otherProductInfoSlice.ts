import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export const OtherProductInfoSchema = z.object({
    price: z.string().nullable(),
})

export type OtherProductInfo = z.infer<typeof OtherProductInfoSchema>

const initialState = {
    price: null
} as OtherProductInfo;

export const productOtherInfo = createSlice({
    name: "productOtherInfo",
    initialState,
    reducers: {
        reset: () => initialState,
        setPrice: (state, action: PayloadAction<string>) => {
            state.price = action.payload;
        }
    },
});

export const {
    reset,
    setPrice
} = productOtherInfo.actions;
export default productOtherInfo.reducer;
