import { storage } from "../config/firebaseConfig";
export async function getClanImageUrl(src: string): Promise<string> {
  try {
    const image = await storage
      .ref(`/clanLogos/${src}.png`)
      .getDownloadURL()
      .catch();
    return image;
  } catch {
    return "/assets/images/clan_placeholder.png";
  }
}
