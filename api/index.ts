import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomString = (length: number = 8): string =>
  randomUUID().slice(0, length);

const randomChoice = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const MAX_COLLECTION_SIZE = parseInt(
  process.env.MAX_COLLECTION_SIZE || "5",
  10
);
const MAX_ARRAY_SIZE = parseInt(process.env.MAX_ARRAY_SIZE || "1000", 10);
const MAX_DEPTH_LIMIT = parseInt(process.env.MAX_DEPTH_LIMIT || "5", 10);

function generateRandomValue(currentDepth: number, maxDepth: number): any {
  if (currentDepth >= maxDepth) {
    return randomChoice([
      randomInt(1, 100),
      randomString(randomInt(5, 12)),
      Math.random() > 0.5,
    ]);
  }

  const types: string[] = ["primitive", "object", "array"];
  const selectedType = randomChoice(types);

  switch (selectedType) {
    case "primitive":
      const primitiveType = Math.random();
      if (primitiveType < 0.5) return randomInt(1, 1000);
      if (primitiveType < 0.8) return randomString(randomInt(8, 16));
      return Math.random() > 0.5;

    case "object":
      const obj: { [key: string]: any } = {};
      const numProperties = randomInt(1, MAX_COLLECTION_SIZE);
      for (let i = 0; i < numProperties; i++) {
        const keyName = randomChoice([
          "id",
          "name",
          "value",
          "details",
          "status",
          `prop_${i}`,
        ]);
        obj[keyName] = generateRandomValue(currentDepth + 1, maxDepth);
      }
      return obj;

    case "array":
      const arr: any[] = [];
      const numElements = randomInt(1, MAX_COLLECTION_SIZE);
      for (let i = 0; i < numElements; i++) {
        arr.push(generateRandomValue(currentDepth + 1, maxDepth));
      }
      return arr;

    default:
      return null;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { pathname } = new URL(req.url || "", `http://${req.headers.host}`);

  // Root route
  if (pathname === "/" || pathname === "") {
    return res
      .status(200)
      .send(
        '<h1>Complex Random Data API</h1><p>Visit <a href="/api/complex-array">/api/complex-array</a> to generate data.</p>'
      );
  }

  // API route
  if (pathname === "/api/complex-array" || pathname === "/complex-array") {
    let size = parseInt(req.query.size as string, 10) || 10;
    let maxDepth = parseInt(req.query.maxDepth as string, 10) || 3;

    if (size > MAX_ARRAY_SIZE) size = MAX_ARRAY_SIZE;
    if (size < 1) size = 1;
    if (maxDepth > MAX_DEPTH_LIMIT) maxDepth = MAX_DEPTH_LIMIT;

    const complexArray = Array.from({ length: size }, () =>
      generateRandomValue(0, maxDepth)
    );

    return res.status(200).json({
      description: "Complex, nested, random data array for JS/TS practice.",
      parameters: {
        size,
        maxDepth,
        generatedTimestamp: new Date().toISOString(),
      },
      data: complexArray,
    });
  }

  // 404 for other routes
  return res.status(404).json({ error: "Not Found" });
}
