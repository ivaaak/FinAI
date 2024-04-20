import { SidebarIcons } from "./SidebarIcons";
import { FC } from 'react';
import './MenuItem.css';

interface MenuItemProps {
    item: {
        id: number;
        title: string;
        notifications: number | boolean;
    };
}

export const MenuItem: FC<MenuItemProps> = ({ item: { id, title, notifications } }) => {
    const baseClass = "w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer";

    return (
        <div
            className={`${baseClass} ${"sidebar-item-selected"}`}
        >
            <SidebarIcons id={id} />
            <div className="block sm:hidden xl:block ml-2">{title}</div>
            <div className="block sm:hidden xl:block flex-grow" />
            {notifications && (
                <div className="flex sm:hidden xl:flex bg-pink-600 w-5 h-5 flex items-center justify-center rounded-full mr-2">
                    <div className="text-white text-sm">{notifications}</div>
                </div>
            )}
        </div>
    );
}
