import { Restaurant } from "../restaurant.model";

export interface NewEditMenuResponse {
    id: number;
    name: string;
    isActive: boolean;
    linkedRestaurants: Restaurant[];
    allRestaurants: Restaurant[];
}