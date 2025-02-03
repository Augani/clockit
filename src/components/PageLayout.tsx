"use client";

import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface PageLayoutProps {
  children: React.ReactNode;
  pageName: string;
}

export default function PageLayout({ children, pageName }: PageLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-gray-50">
      <aside className="hidden lg:block lg:col-span-2">
        <SideBar />
      </aside>
      <div className="flex flex-col w-full lg:col-span-10">
        <div className="w-full h-16">
          <TopBar pageName={pageName} />
        </div>
        <div className="p-4 lg:p-6 w-full mt-6">{children}</div>
      </div>
    </div>
  );
}
