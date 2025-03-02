import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (e) {
    console.error("[SEED.TS] Error uploading image to ImageKit:", e);
  }
};

const seed = async () => {
  console.log("[SEED.TS] seeding data...");
  try {
    for (const book of dummyBooks) {
      //  1.  need to upload the image and videos to imagekit
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/covers", //path
      )) as string;

      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        `${book.title}.jpg`,
        "/books/videos",
      )) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });
    }

    console.log("[SEED.TS] data seek successfully...");
  } catch (e) {
    console.error("[SEED.TS] Error seeding data", e);
  }
};

seed();
