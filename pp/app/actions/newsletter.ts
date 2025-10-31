"use server";

import * as fs from "fs";

const newsletterFile = "app/lib/newsletter.txt";

export async function addToNewsletter(email: string) {
  try {
    fs.appendFileSync(newsletterFile, email + "\n");
    console.log("File written successfully!");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}
