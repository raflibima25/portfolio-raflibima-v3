import React from "react";

import { MENU_ITEMS } from "@/common/constants/menu";

import Copyright from "../../elements/Copyright";
import Breakline from "../../elements/Breakline";
import Profile from "./Profile";
import Menu from "./Menu";

export default function Sidebar() {
  const filteredMenu = MENU_ITEMS?.filter((item) => item?.isShow);
  return (
    <header className="lg:w-1/5 lg:sticky lg:top-4 lg:h-fit">
      <div className="flex flex-col z-10 transition-all duration-300 lg:py-8">
        <Profile />
        <div className="hidden md:block">
          <Breakline />
          <div className="hidden lg:block">
            <Menu list={filteredMenu} />
          </div>
          <Breakline />
          <Copyright />
        </div>
      </div>
    </header>
  );
}
