import { MenuItem } from "./menu-item.model";

export interface MenuItemGroup {
    id: number;
    menuId: number;
    name: string;
    position: number;
    menuItems: MenuItem[];
    uuid: string;
    isEditMode: boolean;

    groupNameError: string;
}