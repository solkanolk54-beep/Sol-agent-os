# Getting Started with Sol Autonomous Agent OS
# دليل البدء السريع لمنظومة الوكلاء المستقلين

Welcome to your modular agent organization framework. This guide covers how to invoke skills and run your company departments efficiently.

## 1. How Skills Are Addressed
Every skill uses a strict namespaced format:
`department:skill-name`

Examples:
- `technology:api-design` -> Generates structured OpenAPI 3.1 & TypeScript contracts.
- `security:security-audit` -> Evaluates code, security vulnerabilities (Reviewer Class).
- `iot-geospatial:geospatial-pipeline` -> Designs spatial pipelines, PostGIS tables & spatial index schemas.
- `operations-finance:unit-economics` -> Computes financial unit margins and break-even points.
- `executive:ceo-advisor` -> Provides strategic bottleneck identification and decision frameworks.
- `growth-marketing:landing-page-cro` -> Delivers high-converting landing page copy & hierarchy.

## 2. Invocation Methods
- **Auto-Routing:** Ask any natural language request (in Arabic or English), and the Router Engine dispatches the matching department & skill.
- **Direct Invocation:** Call a specialist explicitly via `/department:skill-name [context]`.

## 3. The Reviewer Protocol (Reviewer-Class)
When generating technical systems or financial plans, the deliverable must pass through the Reviewer class (`security:security-audit`) to receive an explicit `STATUS: APPROVED` before production release. If marked `STATUS: REJECTED`, the system automatically enters remediation mode.
