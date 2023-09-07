import { BACKEND_BASE_URL } from "@/lib/exposableConsts";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import type { ScrapedProduct } from '../features/scrapedProductSlice'
import { DescriptionSchema } from "./descriptionApi";

// type User = {
//     id: number;
//     name: string;
//     email: number;
// };

export const ProductDetailsSchema = z.object({
    name: z.string(),
    category_id: z.string(),
    images: z.array(z.string()),
    parameters: z.array(z.object({
        name: z.string(),
        values: z.array(z.string().or(z.number()))
    })),
    stock: z.number().default(10),
    price_amount: z.string(),
    condition: z.string().default('Nowy'),
    currency: z.string().default('PLN'),
    description: DescriptionSchema.shape.description
})

export type ProductDetails = z.infer<typeof ProductDetailsSchema>
// export type DescriptionSection = Pick<Description, 'description'>['description']['sections'][0]


export const postOfferApi = createApi({
    reducerPath: "postOfferApi",
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
        postOffer: builder.mutation<any, { detailedProduct: ProductDetails }>({
            query: ({ detailedProduct }) => ({
                url: 'post-offer',
                method: 'POST',
                body: { detailedProduct },
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
    usePostOfferMutation
} = postOfferApi;
