import WebAppLayout from "@/components/Layout/WebAppLayout/WebAppLayout";
import layoutConfig from "@/data/layout.json";
import sidebarTest from "@/data/sidebarTest.json";

export default function WebAppRouteLayout({ children }) {
  return (
    <WebAppLayout
      navigation={layoutConfig.navigation}
      navigationItems={sidebarTest}
    >
      {children}
    </WebAppLayout>
  );
}
