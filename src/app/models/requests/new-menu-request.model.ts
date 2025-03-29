
export interface NewMenuRequest {
    id: number;
    name: string;
    cloneOptionId: number;
    isLinked: boolean;
    restaurantIds: number[];
}