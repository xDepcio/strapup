import { BACKEND_BASE_URL } from "@/lib/exposableConsts";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import type { ScrapedProduct } from '../features/scrapedProductSlice'

// type User = {
//     id: number;
//     name: string;
//     email: number;
// };

export const DescriptionSchema = z.object({
    title: z.string(),
    description: z.object({
        sections: z.array(z.object({
            items: z.union([
                z.tuple([
                    z.discriminatedUnion("type", [
                        z.object({ type: z.literal("TEXT"), content: z.string() }),
                        z.object({ type: z.literal("IMAGE"), url: z.string() }),
                    ]),
                    z.discriminatedUnion("type", [
                        z.object({ type: z.literal("TEXT"), content: z.string() }),
                        z.object({ type: z.literal("IMAGE"), url: z.string() }),
                    ]),
                ]),
                z.tuple([
                    z.discriminatedUnion("type", [
                        z.object({ type: z.literal("TEXT"), content: z.string() }),
                        z.object({ type: z.literal("IMAGE"), url: z.string() }),
                    ]),
                ])
            ])
        }))
    }),
})

export type Description = z.infer<typeof DescriptionSchema>
export type DescriptionSection = Pick<Description, 'description'>['description']['sections'][0]


export const descriptionApi = createApi({
    reducerPath: "descriptionApi",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_BASE_URL,
    }),
    endpoints: (builder) => ({
        // getUsers: builder.query<User[], null>({
        //     query: () => "users",
        // }),
        // getUserById: builder.query<User, { id: string }>({
        //     query: ({ id }) => `users/${id}`,
        // }),
        // getDescription: builder.query<Description, { scrapedProduct: ScrapedProduct }>({
        //     query: ({scrapedProduct}) =>
        // })
        getDescription: builder.mutation<Description, { scrapedProduct: ScrapedProduct }>({
            query: ({ scrapedProduct }) => ({
                url: 'generate-description',
                method: 'POST',
                body: { scrapedProduct },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        })
    }),
});

export const {
    // useGetUsersQuery,
    // useGetUserByIdQuery,
    useGetDescriptionMutation
} = descriptionApi;
