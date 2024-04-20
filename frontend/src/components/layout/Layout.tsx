import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Content } from "./Content";
import './Layout.css';

export const Layout = () => {
    const [showSidebar, onSetShowSidebar] = useState(false);

    return (
        <div className="flex">
            <Sidebar
                onSidebarHide={() => {
                    onSetShowSidebar(false);
                }}
                showSidebar={showSidebar}
            />
            <Content
                onSidebarHide={() => {onSetShowSidebar(true);}}
            />
        </div>
    );
}
