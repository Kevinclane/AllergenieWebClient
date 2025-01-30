import { Allergen } from "./allergen.model";

export interface MenuItem {
    id: number;
    menuId: number;
    name: string;
    price: string;
    description: string;
    extraDetails: string;
    position: number;
    menuItemGroupId: number;
    allergens: Allergen[];
    isEditMode: boolean;
    uuid: string;

    nameError: string;
    descriptionError: string;
}