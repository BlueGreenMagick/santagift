import { ClientMode, defineConfig } from "santagift";

export default defineConfig({ outFile: "result.mobileconfig" }, { ClientMode: ClientMode.Monitor });
