import { ClientMode, defineConfig, PlistData } from "santagift";

export default defineConfig(
  {},
  {
    ClientMode: ClientMode.Monitor,
    ServerAuthRootsData: PlistData.fromBytes(
      new TextEncoder().encode("-----BEGIN CERTIFICATE-----\nTEST\n-----END CERTIFICATE-----\n"),
    ),
  },
);
