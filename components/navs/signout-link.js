import { useClerk } from "@clerk/nextjs";

export default function SignoutLink() {
  const { signOut } = useClerk();
  return (
    <a href="#" onClick={() => signOut()} >
      Sign out
    </a>
  );
}
