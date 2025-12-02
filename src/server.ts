import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3010;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomString = (length: number = 8): string =>
  randomUUID().slice(0, length);
const randomChoice = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

// Define the maximum number of properties for objects/arrays at any level
const MAX_COLLECTION_SIZE = parseInt(
  process.env.MAX_COLLECTION_SIZE || "5",
  10
);
const MAX_ARRAY_SIZE = parseInt(process.env.MAX_ARRAY_SIZE || "1000", 10);
const MAX_DEPTH_LIMIT = parseInt(process.env.MAX_DEPTH_LIMIT || "5", 10);

function generateRandomValue(currentDepth: number, maxDepth: number): any {
  // Stop recursion if maxDepth is reached, forcing a primitive return
  if (currentDepth >= maxDepth) {
    return randomChoice([
      randomInt(1, 100),
      randomString(randomInt(5, 12)),
      Math.random() > 0.5,
    ]);
  }

  // List of possible data types to generate at this level (including primitives)
  const types: string[] = ["primitive", "object", "array"];
  const selectedType = randomChoice(types);

  switch (selectedType) {
    case "primitive":
      // 50% chance for number, 30% string, 20% boolean
      const primitiveType = Math.random();
      if (primitiveType < 0.5) return randomInt(1, 1000);
      if (primitiveType < 0.8) return randomString(randomInt(8, 16));
      return Math.random() > 0.5;

    case "object":
      const obj: { [key: string]: any } = {};
      // Randomly determine how many properties this object will have
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
        // Recursively generate the value for the property
        obj[keyName] = generateRandomValue(currentDepth + 1, maxDepth);
      }
      return obj;

    case "array":
      const arr: any[] = [];
      // Randomly determine the size of the array
      const numElements = randomInt(1, MAX_COLLECTION_SIZE);
      for (let i = 0; i < numElements; i++) {
        // Recursively generate each element
        arr.push(generateRandomValue(currentDepth + 1, maxDepth));
      }
      return arr;

    default:
      return null; // Should not happen
  }
}

// Define the API endpoint for generating the complex random array
app.get("/api/complex-array", (req: Request, res: Response) => {
  // 1. Extract and validate query parameters
  let size = parseInt(req.query.size as string, 10) || 10;
  let maxDepth = parseInt(req.query.maxDepth as string, 10) || 3;

  // Set reasonable caps
  if (size > MAX_ARRAY_SIZE) size = MAX_ARRAY_SIZE;
  if (size < 1) size = 1;
  if (maxDepth > MAX_DEPTH_LIMIT) maxDepth = MAX_DEPTH_LIMIT;

  // 2. Generate the array by repeatedly calling the complex generator
  const complexArray = Array.from({ length: size }, () =>
    generateRandomValue(0, maxDepth)
  );

  // 3. Send the generated array back as a JSON response
  res.json({
    description: "Complex, nested, random data array for JS/TS practice.",
    parameters: {
      size,
      maxDepth,
      // Example of a helpful parameter to include for debugging
      generatedTimestamp: new Date().toISOString(),
    },
    data: complexArray,
  });
});

// A simple root route for basic testing
app.get("/", (req: Request, res: Response) => {
  res.send(
    '<h1>Complex Random Data API</h1><p>Visit <a href="/api/complex-array">/api/complex-array</a> to generate data.</p>'
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(
    "[Server] Data Endpoint: http://localhost:3010/api/complex-array?size=15&maxDepth=4"
  );
});
