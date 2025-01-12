import { Restaurant } from "../restaurant.model";

export interface NewEditMenuRequest {
    id: number;
    name: string;
    isActive: boolean;
    linkedRestaurants: Restaurant[];
    allRestaurants: Restaurant[];
}