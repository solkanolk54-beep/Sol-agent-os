# Dynamic Intent Router Specifications (ROUTING.md)
# مواصفات محرك التوجيه الذكي وفصل النطاقات

## 1. Intent Resolution Algorithm
The router analyzes user prompts through a 3-layer pipeline:
1. **Lexical Token Matching:** Extracted stems and specialized terms (e.g. `postgis`, `geojson`, `telemetry` -> `iot-geospatial`).
2. **Intent Semantic Scoring:** Calculating normalized keyword intersection against department trigger tables:
   ```
   Score(Skill) = count(Matched_Triggers) / count(Total_Triggers)
   ```
3. **Fallback & Escalation:** Prompts scoring < 0.35 default to `executive:ceo-advisor` for strategic clarification and triage.

## 2. Department Trigger Matrix
- **executive:** strategy, vision, ceo, bottleneck, investment, pitch, funding, roadmap, triage, goal
- **technology:** api, rest, grpc, endpoint, backend, database, architecture, clean-code, refactor, debug, schema
- **security:** audit, owasp, ciso, vulnerability, injection, auth, rbac, token, encrypt, penetration, leak
- **iot-geospatial:** postgis, spatial, map, gis, coordinates, gps, telemetry, sensor, mqtt, stream, edge, polygon
- **operations-finance:** unit-economics, cost, margin, pricing, break-even, roi, cogs, supply-chain, revenue
- **growth-marketing:** cro, landing-page, conversion, cta, marketing, funnel, traffic, brand, positioning
