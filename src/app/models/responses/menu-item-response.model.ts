import { Allergen } from "../allergen.model";
import { MenuItemGroup } from "../menu-item-group.model";

export interface MenuItemResponse {
    groupedItems: MenuItemGroup[];
    allergens: Allergen[];
}