import { PYTHON_BACKEDN_URL } from "@/lib/exposableConsts";
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

type GeneratedCategory = {
    name: string | null,
    id: string | null,
    category_tree: { cat_name: string, cat_id: string }[]
};

export type NormalParam = {
    name: string,
    special?: boolean,
} &
    ({
        type: 'dictionary', possibleChoices: string[], yourChoices: string[], restrictions?: {
            multipleChoices?: boolean
        }
    } | {
        type: 'float', yourChoices: number[], restrictions?: {
            min?: number,
            max?: number
            precision?: number
            range?: boolean
        }
    } | {
        type: 'string', yourChoices: string[], restrictions?: {
            maxLength?: number,
            minLength?: number,
            allowedNumberOfValues?: number
        }
    })


type CategoryParams = {
    condition: "Nowy"
    needs_EAN: boolean
    needs_manufacturer: boolean
    normal_params: NormalParam[]
    skipped_params: NormalParam[]
}

const initialState = {
    category: {
        name: null,
        id: null,
        category_tree: []
    },
    subCategories: [],
    categoryParams: null
} as {
    category: GeneratedCategory,
    subCategories: { name: string, id: string }[],
    categoryParams: CategoryParams | null,
};

export const fetchCategory = createAsyncThunk('category/fetchCategory', async (id: string | null) => {
    const response = await fetch(`${PYTHON_BACKEDN_URL}/subcategories?categoryId=${id ? id : ""}`)
    if (response.ok) {
        const data = await response.json()
        return data.data
    }
})

export const fetchCategoryParams = createAsyncThunk('category/fetchCategoryParams', async (id: string) => {
    const response = await fetch(`${PYTHON_BACKEDN_URL}/category-params?categoryId=${id}`)
    if (response.ok) {
        const data = await response.json()
        return data.data
    }
})

export const removeCategoryAndFetchNew = (categoryId: string) => async (dispatch: any, getState: any) => {
    await dispatch(deleteSubCategory({ categoryId: categoryId }))
    await dispatch(fetchCategory(getState().generatedCategoryReducer.category.category_tree[getState().generatedCategoryReducer.category.category_tree.length - 1]?.cat_id))
}

export const generatedCategory = createSlice({
    name: "generatedCategory",
    initialState,
    reducers: {
        reset: () => initialState,
        save: (state, action: PayloadAction<GeneratedCategory>) => {
            state.category = { ...action.payload };
        },
        chooseSubCategory: (state, action: PayloadAction<{ name: string, id: string }>) => {
            state.category?.category_tree.push({
                cat_name: action.payload.name,
                cat_id: action.payload.id
            });
            state.category.name = action.payload.name
            state.category.id = action.payload.id
        },
        deleteSubCategory: (state, action: PayloadAction<{ categoryId: string }>) => {
            state.category?.category_tree.splice(state.category?.category_tree.findIndex((el) => el.cat_id === action.payload.categoryId), 1)
        },
        selectOtherManufacturer: (state, action: PayloadAction<string>) => {
            const current = state.categoryParams?.normal_params.find((el) => el.name === "Producent")!.yourChoices
            current![1] = action.payload
            state!.categoryParams!.normal_params!.find((el) => el.name === "Producent")!.yourChoices! = current!
        },
        selectCategoryParam: (state, action: PayloadAction<{ paramName: string, paramValue: string | number, allowMultipleParams: boolean }>) => {
            // console.log('-------------------------')
            // console.log(action.payload, 'xdd')
            // console.log(state.categoryParams)
            const paramIndex = state.categoryParams?.normal_params.findIndex((el) => el.name === action.payload.paramName)
            // console.log(paramIndex)
            if (paramIndex !== undefined && paramIndex !== -1) {
                if (!action.payload.allowMultipleParams) {
                    state.categoryParams!.normal_params[paramIndex].yourChoices = [action.payload.paramValue] as string[] | number[]
                }
                // if (state.categoryParams?.normal_params[paramIndex].type === "dictionary") {
                else {
                    state.categoryParams?.normal_params[paramIndex].yourChoices.push(action.payload.paramValue as never)
                    // console.log(state.categoryParams?.normal_params[paramIndex].yourChoices)
                }
            }
            // console.log('-------------------------')
        },
        deleteCategoryParam: (state, action: PayloadAction<{ paramName: string, paramValue: string | number }>) => {
            const paramIndex = state.categoryParams?.normal_params.findIndex((el) => el.name === action.payload.paramName)
            if (paramIndex !== undefined && paramIndex !== -1) {
                const indexToDelete: number = state.categoryParams?.normal_params[paramIndex].yourChoices.findIndex((el) => el === action.payload.paramValue)!
                state.categoryParams?.normal_params[paramIndex].yourChoices.splice(indexToDelete, 1)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategory.fulfilled, (state, action) => {
            state.subCategories = [...action.payload];
            console.log(state.subCategories)
        })

        builder.addCase(fetchCategoryParams.fulfilled, (state, action) => {
            state.categoryParams = { ...action.payload };
            console.log(state.categoryParams)
        })
    }
});

export const {
    reset,
    save,
    chooseSubCategory,
    deleteSubCategory,
    selectCategoryParam,
    deleteCategoryParam,
    selectOtherManufacturer
} = generatedCategory.actions;
export default generatedCategory.reducer;
