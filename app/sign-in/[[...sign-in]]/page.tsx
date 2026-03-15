import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <SignIn />
      </div>
    </div>
  );
}
