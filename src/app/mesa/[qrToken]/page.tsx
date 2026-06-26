import { PublicOrderingScreen } from "@/modules/public-ordering/presentation/components/public-ordering-screen";

export default async function PublicTablePage({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const { qrToken } = await params;
  return <PublicOrderingScreen qrToken={qrToken} />;
}
