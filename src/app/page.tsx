"use client";

import { useState } from "react";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import UploadProduct from "./components/UploadProduct";

import UserList from "./components/UserList";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Banner />
        <h1 className="text-2xl font-bold">Welcome to DukandarShandar</h1>
        {/* <UserList /> */}
        <UploadProduct onProductUpload={() => setRefreshTrigger((prev) => !prev)} /> {/* ✅ Trigger refresh */}
        <ProductList refreshTrigger={refreshTrigger} /> {/* ✅ Pass refreshTrigger */}

      </main>
    </>
  );
}
