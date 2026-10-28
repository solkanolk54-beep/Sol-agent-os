# Sol Agent OS Architecture & Technical Standards
# المعايير والمواصفات المعمارية القياسية للمنصة

## 1. Specification Protocols
* **API Design:** All REST endpoints must conform to OpenAPI 3.1 specifications. gRPC services must provide Protocol Buffer v3 schemas.
* **Error Standard:** Standard RFC 7807 Problem Details object:
  ```json
  {
    "type": "https://api.sol-os.internal/errors/invalid-token",
    "title": "Unauthorized Access",
    "status": 401,
    "detail": "Bearer token expired at 2026-10-28T02:00:00Z",
    "instance": "/api/v1/telemetry/stream-9821"
  }
  ```
* **Spatial & GIS Standards:** PostGIS spatial queries must utilize `GEOGRAPHY(Point, 4326)` for geodesic coordinates and `GEOMETRY` for projected planar calculations. Enforce GiST indexes on spatial columns.
* **Telemetry & IoT Streams:** Real-time ingestion via MQTT 5.0 with Redis Streams buffer for backpressure management and timeseries downsampling.
* **Financial Calculations:** Decimal precision (never float) for currency. Unit economics calculations must state explicit Gross Margin target (e.g. >= 45%).
* **Security & OWASP:** All inputs must be strictly validated using Zod or JSON Schema. Parameterized queries for all SQL/PostGIS commands. Zero wildcard CORS in production.
