# Complex Random Data Generator API

A lightweight Express API that generates complex, nested random data structures for testing, prototyping, and playground purposes.

## Why This Project?

As developers, we often need realistic test data for:

- Testing data processing functions
- Prototyping UI components
- Learning array/object manipulation
- Practicing recursion and data traversal
- API integration testing

Instead of manually creating mock data or using heavyweight tools, this API provides instant, customizable random data structures with configurable depth and complexity.

## Features

- 🎲 **Random data generation** with primitives, objects, and arrays
- 🔄 **Recursive nesting** with configurable depth limits
- ⚙️ **Customizable parameters** via query strings
- 🚀 **Lightweight** with no external dependencies beyond Express
- 🛡️ **Safe defaults** with built-in limits to prevent resource exhaustion

## Quick Start

### Installation

```bash
npm install
```

### Environment Variables (Optional)

Create a `.env` file to customize limits:

```env
MAX_COLLECTION_SIZE=5    # Max properties per object/array
MAX_ARRAY_SIZE=1000      # Max top-level array size
MAX_DEPTH_LIMIT=5        # Max nesting depth
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3010`

## API Endpoints

### `GET /api/complex-array`

Generates a random array of complex, nested data structures.

#### Query Parameters

| Parameter  | Type   | Default | Description                              |
| ---------- | ------ | ------- | ---------------------------------------- |
| `size`     | number | 10      | Number of elements in the array          |
| `maxDepth` | number | 3       | Maximum nesting depth for objects/arrays |

#### Example Requests

**Basic usage:**

```
GET http://localhost:3010/api/complex-array
```

**Custom size and depth:**

```
GET http://localhost:3010/api/complex-array?size=15&maxDepth=4
```

**Large dataset:**

```
GET http://localhost:3010/api/complex-array?size=100&maxDepth=2
```

#### Response Format

```json
{
  "description": "Complex, nested, random data array for JS/TS practice.",
  "parameters": {
    "size": 15,
    "maxDepth": 4,
    "generatedTimestamp": "2024-01-15T10:30:00.000Z"
  },
  "data": [
    {
      "id": "a3f2b1c4",
      "details": {
        "status": true,
        "value": [42, "randomStr", false]
      }
    }
    // ... more elements
  ]
}
```

## Data Types Generated

The generator creates a mix of:

- **Primitives**: Numbers (1-1000), strings (UUIDs), booleans
- **Objects**: With random properties like `id`, `name`, `value`, `details`, `status`
- **Arrays**: With random elements of any type
- **Nested structures**: Objects containing arrays, arrays containing objects, etc.

## Use Cases

- **Frontend Development**: Mock data for component development
- **Algorithm Practice**: Test sorting, filtering, and mapping functions
- **Learning TypeScript**: Practice type guards and type inference
- **API Testing**: Generate payloads for integration tests
- **Recursion Practice**: Work with deeply nested structures

## Configuration Limits

Default safety limits (configurable via environment variables):

- Maximum array size: 1,000 elements
- Maximum nesting depth: 5 levels
- Maximum properties per object: 5

These limits prevent excessive memory usage and ensure reasonable response times.

## Tech Stack

- **Node.js** with TypeScript
- **Express** for the API server
- **dotenv** for environment configuration

## License

MIT

## Contributing

Feel free to open issues or submit PRs for improvements!
