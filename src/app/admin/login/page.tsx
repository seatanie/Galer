import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20" />
      <LoginForm />
    </div>
  );
}
