export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute -z-50 h-screen w-screen bg-[url('/assets/images/auth-bg.svg')] bg-repeat" />
      {children}
    </div>
  );
}
