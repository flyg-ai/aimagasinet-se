import { notFound, redirect } from 'next/navigation';
import { adminEnabled, isAdmin } from '@/lib/admin/auth';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  if (!adminEnabled()) notFound();
  if (isAdmin()) redirect('/admin/');
  return (
    <div className="adm" style={{ maxWidth: 420 }}>
      <h1>Logga in</h1>
      <LoginForm />
    </div>
  );
}
