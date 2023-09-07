import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ScrapedProduct = {
    title: string
    price: number
    currency: string
    main_images: string[]
    product_overview: string
    product_features: string
    product_tech_data: string
    product_desc: string
};

const initialState = {
    productData: null
} as { productData: ScrapedProduct | null };

export const scrapedProduct = createSlice({
    name: "scrapedProduct",
    initialState,
    reducers: {
        reset: () => initialState,
        save: (state, action: PayloadAction<ScrapedProduct>) => {
            state.productData = { ...action.payload };
        },
        deleteImage: (state, action: PayloadAction<string>) => {
            state.productData?.main_images.splice(state.productData?.main_images.indexOf(action.payload), 1);
        },
        switchImagesPositions: (state, action: PayloadAction<{ firstIndex: number, secondIndex: number }>) => {
            if (state.productData) {
                const { firstIndex, secondIndex } = action.payload;
                const temp = state.productData?.main_images[firstIndex];
                state.productData.main_images[firstIndex] = state.productData?.main_images[secondIndex];
                state.productData.main_images[secondIndex] = temp;
            }
        }
    },
});

export const {
    reset,
    save,
    deleteImage,
    switchImagesPositions
} = scrapedProduct.actions;
export default scrapedProduct.reducer;
