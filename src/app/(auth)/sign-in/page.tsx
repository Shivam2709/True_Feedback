"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button
        className="bg-orange-500 text-white m-4 border rounded border-none"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}