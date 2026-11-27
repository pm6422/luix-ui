import { InlineLoading } from "./inline-loading";

export interface RouteLoadingProps {
  text?: string;
}

export default function RouteLoading({ text = "Loading..." }: RouteLoadingProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <InlineLoading size="lg" text={text} />
    </div>
  );
}
