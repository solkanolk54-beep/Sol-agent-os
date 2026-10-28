# Agent Governance & Routing Protocol (AGENTS.md)
# دستور حوكمة وبروتوكول الوكلاء المستقلين - Sol Autonomous Agent OS

## 1. Core Principles (المبادئ الجوهرية)
* **Single Responsibility (المسؤولية الأحادية):** Every agent skill handles exactly one specialized capability with deterministic boundaries.
* **Isolated Write Surfaces (عزل أسطح الكتابة):** Producer agents write code, schemas, and operational plans. Reviewers never modify files directly—they only inspect and issue immutable PASS/FAIL decisions.
* **Strict Namespace Routing (التوجيه الصارم للنطاقات):** All skills and agents are addressed via canonical `department:skill-name` (e.g., `technology:api-design`, `security:security-audit`, `iot-geospatial:geospatial-pipeline`).
* **Zero Context Bloat (تفادي تضخم السياق):** The Orchestrator injects solely the exact matching skill specification into the prompt context to maximize reasoning density and prevent hallucination.
* **Veto Supremacy (سلطة النقض المطلقة):** Reviewer-class outputs override producer deliverables. Any `STATUS: REJECTED` verdict halts production until all remediation points are met.

## 2. Department Classification (تصنيف الإدارات والوكلاء)

### A. Producer Class (فئة المنتجين)
Generates blueprints, code architectures, spatial models, financial break-even matrices, and growth blueprints:
1. **Executive Dept (`executive`):** Strategic roadmap, core bottleneck identification, ROI validation.
2. **Technology Dept (`technology`):** API specs (OpenAPI 3.1), microservice architectures, clean code, systematic debugging.
3. **IoT & Spatial Intelligence (`iot-geospatial`):** Real-time spatial pipelines (PostGIS, Redis Streams, WebGL GIS), sensor edge analytics, AI pipelines.
4. **Operations & Finance (`operations-finance`):** Unit economics, gross margin calculation, cost optimization, supply chain tracking.
5. **Growth & Marketing (`growth-marketing`):** Landing page CRO, conversion hierarchy, messaging framework, demand generation.

### B. Reviewer Class (فئة المراجعين والمدققين)
1. **Security & Audit (`security`):** Independent audit surface. Inspects inputs, auth flows, SQL injections, data leaks, and OWASP compliance.
2. **Verdict Requirement:** Reviewers MUST conclude with an unambiguous verdict:
   - `STATUS: APPROVED`
   - `STATUS: REJECTED` with prioritized issues list (`[CRITICAL]`, `[HIGH]`, `[MEDIUM]`) and step-by-step remediation commands.

## 3. Invocation Protocol & Lifecycle (دورة الاستدعاء والتنفيذ)
```
[User Trigger / Request]
         │
         ▼
[Dynamic Intent Router] ────> Evaluates lexical & semantic match (department:skill)
         │
         ▼
[Producer Execution]    ────> Operates strictly within isolated write surface
         │
         ▼
[Reviewer Audit Gate]   ────> Mandatory CISO / Audit evaluation
         │
    ┌────┴────┐
    │         │
[REJECTED] [APPROVED]
    │         │
    ▼         ▼
[Auto-Refactor] [Final Certified Deliverable]
```

## 4. Addressing & Invocation Syntax
- **Automated Routing:** Natural language query evaluated against intent scoring matrix.
- **Direct Namespace Calling:** `/department:skill-name [context/parameters]`
- **Chained Execution:** `/department:skill-name | audit:security-audit`
