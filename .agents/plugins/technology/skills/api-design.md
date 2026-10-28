---
name: technology:api-design
department: technology
class: producer
triggers: ["api", "rest", "grpc", "endpoint", "openapi", "swagger", "payload", "postgis", "crud"]
description: Designs RESTful and gRPC API specs (OpenAPI 3.1) with strict data validation, cursor pagination, and RFC 7807 error handling.
---

# API Design Specialist (Technology Dept)

## Objective
Design robust, scalable, enterprise-grade, and versioned APIs strictly adhering to clean architectural patterns.

## Execution Rules
1. **Format:** Output OpenAPI 3.1 YAML/JSON or strict TypeScript interface definitions.
2. **Data Model:** Include explicit data types, required fields, nullability, and validation regex where applicable.
3. **Pagination & Limits:** Default list endpoints to cursor-based or limit/offset pagination (default limit: 20, max: 100).
4. **Error Schema:** Enforce a unified RFC 7807 error format:
   `{ "type": string, "title": string, "status": number, "detail": string, "instance": string }`
5. **Versioning:** URL-based versioning (`/api/v1/...`).

## Mandatory Deliverable
- Endpoints Definition with HTTP methods (GET, POST, PUT, DELETE)
- Request/Response Payloads with full types
- Status Code Matrix (200, 201, 400, 401, 403, 404, 422, 500)
- Sample cURL command for testing
