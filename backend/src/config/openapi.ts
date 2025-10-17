import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { OpenAPIV3 } from 'openapi-types';

const openApiPath = path.join(__dirname, '../../openapi.yaml');

let openApiSpec: OpenAPIV3.Document;

try {
  const fileContents = fs.readFileSync(openApiPath, 'utf8');
  openApiSpec = YAML.parse(fileContents) as OpenAPIV3.Document;
} catch (error) {
  console.error(`Failed to load OpenAPI spec:`, error);
  process.exit(1);
}

export { openApiSpec };
