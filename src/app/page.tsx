import Banner from "./components/Banner";

import UserList from "./components/UserList";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Banner />
        <h1 className="text-2xl font-bold">Welcome to DukandarShandar</h1>
        <UserList />
      </main>
    </>
  );
}
