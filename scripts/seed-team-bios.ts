/**
 * One-shot: set public bios on existing team members, matched by fullName.
 *
 * Usage (from repo root, with Admin credentials in env):
 *   npx tsx scripts/seed-team-bios.ts
 *
 * Requires FIREBASE_ADMIN_* or FIREBASE_ADMIN_CREDENTIALS.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FieldValue } from "firebase-admin/firestore";

const BIOS_BY_NAME: Record<string, string> = {
  "Dr. Manish Pandey":
    "Assistant Professor of Civil Engineering at IIT Kharagpur, working on river hydraulics, sediment transport, and drainage planning. He has led consulting studies including the Drainage Master Plan for Bharatpur City and a catchment-level hydraulic assessment for the Wardha river basin, along with surge analysis for lift irrigation systems. His two patented river engineering solutions, a sediment flusher and an airfoil-shaped pier collar, tackle erosion and scour problems common to Indian rivers. He sits on the editorial boards of several international water engineering journals and won the Willi H. Hager Award at the 2025 IAHR World Congress.",
  "Dr. Vinay Yadav":
    "Assistant Professor at the Vinod Gupta School of Management, IIT Kharagpur, where he heads the Environmental Management Research Laboratory. His work centers on municipal solid waste management, plastics circularity, and facility-location optimisation for Indian cities, including a government-funded study comparing centralised and decentralised waste systems for Nashik. He built the EMRL MSW Decision-Support Web Tool, an open access platform that helps Indian cities model the cost and environmental impact of different waste management approaches. A former Marie Curie postdoctoral fellow at the Technical University of Denmark, his research has been covered by Hindustan Times, Forbes, and IndiaSpend.",
  "Vidhu Saxena":
    "Product management leader with over 19 years of experience across PropTech, FinTech, SaaS, and retail. He holds a B.Arch from IIT Roorkee and an MBA from IIM Tiruchirappalli, and is a certified AI Product Manager. As Vice President of Product at Estater.com, he built a Series-A PropTech platform from scratch and launched an AI-powered SaaS product for real estate valuation that generated $0.8 million in revenue within six months. He has also led product teams at Housing.com, IMMO Capital, and FundsIndia, and currently consults on AI-native product strategy for clients including Reliance Retail.",
  "Sanjay Pal":
    "Architect and construction technology entrepreneur based in Roorkee, with two decades in the field. He founded Northpoint in 2006, providing architectural, construction, and project management consultancy services, and has served as Director of Operations at Occulus Designs since 2012, delivering architecture, landscape, and interior design projects. He currently leads Ovolo IT Building Solutions, a construction technology venture incubated at IIT Roorkee's TIDES Business Incubator, building IT products for the construction sector. His early career included a strategy implementation role during ACC's transition under Holcim, alongside Boston Consulting Group, and research work at the Central Building Research Institute on the design of Haldwani Medical College.",
};

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value.replace(/\\n/g, "\n");
    }
  }
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const { getFirebaseAdminDb } = await import("../src/lib/firebase-admin");
  const { ADMIN_COLLECTION, ADMIN_DOC_ID } = await import(
    "../src/lib/admin-firestore"
  );
  const { TEAM_MEMBERS_COLLECTION } = await import("../src/lib/teams-data");

  const members = await getFirebaseAdminDb()
    .collection(ADMIN_COLLECTION)
    .doc(ADMIN_DOC_ID)
    .collection(TEAM_MEMBERS_COLLECTION)
    .get();

  const remaining = new Set(Object.keys(BIOS_BY_NAME));

  for (const docSnap of members.docs) {
    const fullName = String(docSnap.data().fullName || "").trim();
    const bio = BIOS_BY_NAME[fullName];
    if (!bio) continue;

    await docSnap.ref.update({
      bio,
      updatedAt: FieldValue.serverTimestamp(),
    });
    remaining.delete(fullName);
    console.log(`Updated bio: ${fullName}`);
  }

  if (remaining.size > 0) {
    throw new Error(
      `No team member matched: ${[...remaining].join(", ")}`,
    );
  }

  console.log("Team bios updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
