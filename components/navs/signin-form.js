import { SignIn } from "@clerk/nextjs";

export default function SigninForm() {
  return (
    <div style={{textAlign: 'center'}}>
        <h1>Writer Portal</h1>
        <p>This portal is exclusively for <a href="https://draft.dev/">Draft.dev</a> writers.</p>
        <p>Log in using the same email you used to apply.</p>
        <SignIn />
    </div>
  );
}
