"use client";

import { loadUser } from "../../lib/loadUser";

export default function UserPage() {
  const test = async () => {
    const user = await loadUser();
    console.log("USER:", user);
  };

  return <button onClick={test}>Load User</button>;
}
