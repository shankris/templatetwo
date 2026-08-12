import DevicePreview from "@/components/UI/DevicePreview/DevicePreview";

export default async function DeviceTestPage({ searchParams }) {
  const params = await searchParams;

  const requestedSrc = params?.src || "/sidebar-test";
  const requestedDevice = params?.device || "desktop";

  const src = requestedSrc.startsWith("/") && !requestedSrc.startsWith("//") ? requestedSrc : "/sidebar-test";

  const device = ["desktop", "tablet", "mobile"].includes(requestedDevice) ? requestedDevice : "desktop";

  return (
    <DevicePreview
      src={src}
      initialDevice={device}
    />
  );
}
