# 🎬 Movie Recommendation API

A lightweight **Cloudflare Workers backend** that powers the Movie Recommendation Assistant. Guided by three discovery questions, the API uses an LLM to generate personalized movie recommendations based on emotional needs, mental state, and desired viewing experience.

**Standalone backend repo** – pairs with the frontend repo (`movie-recommendation`).

---

## ✨ How It Works

The API guides users through three questions to understand their context, then uses those answers to generate a tailored movie recommendation via LLM.

### **Question 1: What do you need from a movie right now?**

_Captures emotional/thematic intent_

- 🚪 **Escape** – Transport me somewhere else
- 🪞 **Validate** – See my feelings reflected
- ❓ **Challenge** – Question my assumptions
- ⬆️ **Inspire** – Lift me up & motivate me
- 🧘 **Soothe** – Calm my mind & relax
- 🤝 **Connect** – Feel understood & less alone

### **Question 2: How much mental energy do you have?**

_Captures cognitive bandwidth_

- 💤 **Depleted** – I need something that asks nothing of me
- 👁️ **Present** – I can follow along without strain
- ⚡ **Alert** – I'm ready to think & be challenged
- 🎲 **Flexible** – Surprise me based on my other answers

### **Question 3: What kind of experience do you want?**

_Captures sensory/narrative preference_

- 🎭 **Intimate** – Close-up human stories, emotional depth
- 🏔️ **Epic** – Grand scale, sweeping scope, bigger-than-life
- 🔥 **Visceral** – Strong sensory experience (visuals, sound, tension)
- 🧩 **Cerebral** – Intellectual puzzle, ideas matter most
- 💨 **Kinetic** – Movement & momentum, things happen fast
- 🎲 **Surprise me** – Let my answers guide you

---

## 🧠 API Contract

### Endpoint

```http
POST /api/recommend
Content-Type: application/json
```

### Request Body

```json
{
  "q1": 0,
  "q2": 1,
  "q3": 2
}
```

Where each value is an integer index corresponding to the answer choice for each question.

### Response Shape

```json
{
  "ok": true,
  "recommendation": {
    "title": "Inception",
    "reason": "A mind-bending adventure that transports you to surreal worlds...",
    "director": "Christopher Nolan"
  }
}
```

Error response:

```json
{
  "ok": false,
  "error": "Missing answer for q1: What do you need from a movie right now?"
}
```

---

## 📁 Project Structure

```text
movie-recommendation-api/
├── src/
│   ├── index.js                      # Worker entry point
│   ├── routes/
│   │   └── recommend.js              # POST /api/recommend route
│   ├── controllers/
│   │   └── recommendController.js    # Request handler & orchestration
│   ├── services/
│   │   ├── recommendService.js       # Core recommendation logic
│   │   └── llmService.js             # LLM integration layer
│   ├── db/
│   │   ├── prismaClient.js           # Prisma client setup
│   │   └── repositories/
│   │       └── recommendationRepository.js
│   └── utils/
│       ├── validation.js             # Payload validation (q1, q2, q3)
│       └── constants.js              # Question & answer mappings
├── prisma/
│   └── schema.prisma                 # Data models
├── tests/
│   ├── recommend.test.js             # API endpoint tests
│   └── validation.test.js            # Input validation tests
├── vitest.config.js                  # Test configuration
├── wrangler.toml                     # Cloudflare Worker config
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account + `wrangler` CLI installed. [developers.cloudflare](https://developers.cloudflare.com/workers/get-started/guide/)
- An LLM API key (Cloudflare Workers AI)

### Installation

```bash
# Clone and install
git clone https://github.com/jackaguilera/movie-recommendation-api.git
cd movie-recommendation-api
npm install
```

### Environment Setup

#### Local Development (`.dev.vars`)

For local testing with `npm run dev`, create a `.dev.vars` file in the project root:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your local configuration:

```plaintext
# LLM Configuration
CLOUDFLARE_ACCOUNT_ID=abc123
AI_API_KEY=super-secret
```

The `.dev.vars` file is **gitignored** and will not be committed. Use `.dev.vars.example` as a template for others.

#### Production (Environment Variables in Cloudflare)

For production deployment, set environment variables in Cloudflare's dashboard or via `wrangler`:

```bash
wrangler secret put CLOUDFLARE_ACCOUNT_ID
# Enter: your own cloudflare account ID

wrangler secret AI_API_KEY
# Enter: your-production-api-key
```

Then deploy with:

```bash
wrangler deploy
```

### Local Development

```bash
# Start dev server (http://127.0.0.1:8787)
npm run dev

# Run tests
npm run test:run

# Watch tests
npm run test:watch
```

### Test the API Locally

```bash
curl -X POST http://127.0.0.1:8787/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"q1": 0, "q2": 1, "q3": 2}'
```

Expected response (EXAMPLE):

```json
{
  "ok": true,
  "recommendation": {
    "title": "Spirited Away",
    "reason": "A visually stunning escape that soothes and transports...",
    "director": "Hayao Miyazaki"
  }
}
```

---

## 🌐 Deployment

### Deploy to Cloudflare Workers

```bash
npm run deploy
```

This deploys your Worker to Cloudflare's edge network. The Worker will be available at:

```text
https://movie-recommendation-api.<account>.workers.dev
```

### Connect Frontend

In the frontend repo (Vite + React), configure the API URL:

```env
VITE_API_URL=https://movie-recommendation-api.<account>.workers.dev/api/recommend
```

---

## 🧪 Testing

The project uses **Vitest** for testing with comprehensive coverage of:

- ✅ Validation logic for q1, q2, q3 inputs
- ✅ Valid answer range checks
- ✅ Missing/invalid payload rejection
- ✅ API endpoint integration

```bash
# Run all tests
npm run test:run

# Watch mode (live reload)
npm run test:watch
```

## 📦 Core Modules

### `validation.js`

Validates the three-question payload:

- Checks all questions (q1, q2, q3) are present
- Validates answer values are integers within valid ranges
- Returns detailed error messages with question identifiers

### `recommendService.js`

Orchestrates the recommendation flow:

- Accepts validated answers
- Calls LLM service with question context
- Formats response (title, reason, director)

### `llmService.js`

Wraps LLM API calls:

- Supports multiple LLM providers (OpenAI, Anthropic, etc.)
- Constructs context-aware prompts using the three questions
- Parses structured recommendations from LLM output

---

## 📌 Roadmap

### v1 — MVP (current)

- [x] `POST /api/recommend` endpoint with three-question flow
- [x] Input validation (q1, q2, q3)
- [x] LLM integration for movie recommendations
- [o] Comprehensive test suite (Vitest)
- [o] Cloudflare Workers deployment

### v2

- [ ] TMDB integration for posters, ratings, trailers
- [ ] Movie metadata caching with Prisma
- [ ] Support for multiple recommendation variants
- [ ] User feedback collection

### v3

- [ ] Free-text recommendation endpoint
- [ ] Vector embeddings for similarity search
- [ ] User accounts and preference history
- [ ] Durable Objects for stateful recommendation sessions

---

## 🤝 Related Repos

| **Repo**                                                                             | **Purpose**                     |
| ------------------------------------------------------------------------------------ | ------------------------------- |
| [movie-recommendation-api](https://github.com/jackaguilera/movie-recommendation-api) | Cloudflare Worker + LLM backend |
| [movie-recommendation](https://github.com/jackaguilera/movie-recommendation)         | Vite + React frontend UI        |

---

## 📄 License

**MIT** – Deploy and modify freely.
