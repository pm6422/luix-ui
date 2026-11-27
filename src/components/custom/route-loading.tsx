import { InlineLoading } from "./inline-loading";

export default function RouteLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <InlineLoading size="lg" text="Loading Sky Trading..." />
    </div>
  );
}
