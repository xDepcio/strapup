import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from 'zod'
import type { Description } from '../services/descriptionApi'

const dummyDesc: Description = {
    title: 'tytul',
    description: {
        sections: [
            {
                items: [
                    {
                        type: 'TEXT',
                        content: 'testoyt xrfeasds'
                    },
                ]
            }
        ]
    }
}

const initialState = {
    // description: null
    description: dummyDesc
} as { description: Description | null };

export const description = createSlice({
    name: "scrapedProduct",
    initialState,
    reducers: {
        setDescription: (state, action: PayloadAction<Description>) => {
            state.description = action.payload
        },
        addSection: (state) => {
            if (state.description) {
                console.log('addSection')
                state.description.description.sections.push({
                    items: [
                        {
                            type: 'TEXT',
                            content: ''
                        }
                    ]
                })
            }
        },
        changeSection: (state, action: PayloadAction<{ sectionIndex: number, section: Description['description']['sections'][0] }>) => {
            if (state.description) {
                state.description.description.sections[action.payload.sectionIndex] = action.payload.section
            }
        },
        setSectionImage: (state, action: PayloadAction<{ sectionIndex: number, itemIndex: number, url: string }>) => {
            if (state.description) {
                state.description.description.sections[action.payload.sectionIndex].items[action.payload.itemIndex] = {
                    type: 'IMAGE',
                    url: action.payload.url
                }
            }
        },
        setSectionText: (state, action: PayloadAction<{ sectionIndex: number, itemIndex: number, text: string }>) => {
            if (state.description) {
                state.description.description.sections[action.payload.sectionIndex].items[action.payload.itemIndex] = {
                    type: 'TEXT',
                    content: action.payload.text
                }
            }
        },
        deleteSection: (state, action: PayloadAction<{ sectionIndex: number }>) => {
            if (state.description) {
                state.description.description.sections.splice(action.payload.sectionIndex, 1)
            }
        },
        setTitle: (state, action: PayloadAction<{ title: string }>) => {
            if (state.description) {
                state.description.title = action.payload.title
            }
        }
    },
});

export const {
    // reset,
    // save,
    // deleteImage
    addSection,
    changeSection,
    deleteSection,
    setDescription,
    setTitle,
    setSectionImage,
    setSectionText
} = description.actions;
export default description.reducer;
