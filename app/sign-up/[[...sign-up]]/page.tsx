import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <SignUp />
      </div>
    </div>
  );
}
