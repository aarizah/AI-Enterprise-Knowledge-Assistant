# **Case Study – AI Enterprise Knowledge Assistant (EKA)**

## **1. One-Line Summary**
A *ChatGPT-style enterprise assistant* powered by internal company data, delivering **verifiable, citation-based answers** and capable of **executing real actions** (create tickets, send reports, update CRM) directly from Slack or a web interface.

---

## **2. Problem**
- Internal knowledge is scattered across **PDFs, wikis, Google Drive, Notion**, and shared folders.  
- Employees lose **4–6 hours per week** searching for information or asking colleagues.  
- Internal support teams (IT, HR, Legal) are **overloaded**, causing operational bottlenecks.  
- Traditional chatbots **hallinate**, cannot act on systems, and fail to build trust.

**Negative impact:** wasted time, slow decision-making, overwhelmed support teams, and risk from incorrect answers.

---

## **3. Solution**
The **Enterprise Knowledge Assistant (EKA)** centralizes internal knowledge, answers questions with **verified citations**, and performs **real actions** across enterprise systems.

### Core Capabilities
- **Unified knowledge ingestion:** PDFs, Google Drive, Confluence, Notion.  
- **Citation-based answers:** if no evidence exists, it returns *“no answer.”*  
- **Action execution:** create Jira tickets, send emails, update HubSpot contacts, etc.  
- **Enterprise-grade security:** RBAC, SSO (Google/Slack), data isolation, audit logs.  
- **Observability:** usage metrics, latency, cost monitoring, “no answer” rate.

---

## **4. Key Differentiators**
- **Not just “chat with PDFs”**  
  - Always returns source-linked, auditable answers.  
  - Strict evidence gating—no hallucinations.  
- **Actionable, not passive**  
  - Triggers workflows (tickets, emails, CRM updates).  
- **Micro-SaaS ready**  
  - Multi-tenant architecture, simple auth, tenant data isolation.  
- **Product-oriented design**  
  - 5-minute setup, clean UX, guided onboarding.  
- **Reliable & cost-efficient**  
  - Multimodel routing, caching, fallback logic.

---

## **5. High-Level Architecture**
**Ingestion** (PDF/Drive connectors) →  
**Preprocessing** (chunking + metadata) →  
**Vector DB** (Postgres + pgvector) →  
**Orchestration** (LangChain/LlamaIndex + tools) →  
**LLM** →  
**Guardrails** (citation enforcement, PII filtering, no-answer detection) →  
**Action Layer** (Jira/Gmail/HubSpot APIs) →  
**Telemetry** (logging, latency, cost).

---

## **6. Functional MVP (Demo Features)**
- Document upload (PDF/Google Drive).  
- Chat with citation-based answers.  
- Action buttons: create Jira ticket, send email, trigger workflow.  
- Admin panel with dataset management, roles, and basic analytics.  
- Web deployment with Google/Slack login.

---

## **7. Instrumented Metrics**

### **Quality**
- % of answers with citations  
- “No answer” rate  

### **Performance**
- Time to first token  
- p95 latency < 2s  

### **Cost**
- Cost per 100 queries  
- Caching/model routing savings  

### **Security**
- Detected PII and automatic redaction  

### **Adoption**
- Daily queries  
- Active users  
- CSAT (👍/👎)

---

## **8. Results (Simulated Data)**
- **40% reduction** in internal search time  
- **30% fewer support tickets** in IT/HR  
- **92% citation-verified answers**  
- **35% lower query cost** using routing + caching  
