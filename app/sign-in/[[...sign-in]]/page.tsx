import { SignIn } from "@clerk/nextjs";

export default function Page({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  console.log(searchParams);
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
}
