'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../actions';

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn" type="submit" disabled={pending} style={{ marginTop: 16 }}>{pending ? 'Loggar in …' : 'Logga in'}</button>;
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, undefined);
  return (
    <form action={action}>
      <label htmlFor="password">Lösenord</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      {state?.error && <p className="over" role="alert">{state.error}</p>}
      <Submit />
    </form>
  );
}
