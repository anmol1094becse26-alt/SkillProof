/**
 * SKILLPROOF — SECURE AI GATEWAY
 * Routes all AI calls server-side. API key is NEVER exposed to the client.
 * Supports Google Gemini (primary) with graceful fallback error handling.
 */

const https = require('https');

const AI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
const AI_MODEL   = 'gemini-1.5-flash-latest';
const AI_TIMEOUT = 30000; // 30 s

/**
 * Core fetch wrapper for Gemini generateContent REST endpoint.
 */
function callGemini(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    if (!AI_API_KEY) {
      return reject(new Error('AI_API_KEY environment variable is not set. Add GEMINI_API_KEY to your .env file.'));
    }

    const body = JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (resp) => {
      let raw = '';
      resp.on('data', chunk => raw += chunk);
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) return reject(new Error(parsed.error.message || 'Gemini API error'));
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          // The model returns JSON inside the text field when responseMimeType is set
          resolve(JSON.parse(text));
        } catch (e) {
          reject(new Error('Failed to parse AI response as JSON: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(AI_TIMEOUT, () => {
      req.destroy();
      reject(new Error('AI request timed out after 30 seconds.'));
    });

    req.write(body);
    req.end();
  });
}

// ─────────────────────────────────────────────
// 1. CHALLENGE GENERATOR
// ─────────────────────────────────────────────
const CHALLENGE_SYSTEM_PROMPT = `
You are an expert technical hiring manager and software engineer creating realistic, workplace-grounded coding challenges for a skill verification platform.
Generate a single challenge as STRICT JSON — no markdown, no prose, only valid JSON matching this EXACT schema:

{
  "title": "string — specific, job-relevant title (not generic textbook)",
  "problem_statement": "string — 3-5 sentence realistic workplace scenario",
  "starter_code": "string — actual incomplete/broken JavaScript code or scenario prompt text the student works with",
  "requirements": ["string", "string", "string"],
  "test_cases": [
    { "name": "string", "input": "string", "expected": "string", "type": "visible|edge|perf", "explanation": "string" }
  ],
  "evaluation_rubric": {
    "correctness": "string — description of correctness scoring (0-50 pts)",
    "code_quality": "string — description of code quality scoring (0-30 pts)",
    "edge_cases": "string — description of edge case scoring (0-20 pts)"
  },
  "verification_questions": ["string", "string"],
  "required_skills": ["string"],
  "category": "string",
  "difficulty": "Beginner|Intermediate|Advanced",
  "duration_minutes": number
}

Rules:
- Requirements MUST be an array of 3-5 strings.
- test_cases MUST be an array with 3-5 entries.
- verification_questions MUST be EXACTLY 2 questions referencing specific logic choices.
- starter_code must be ACTUAL CODE (broken/incomplete) for coding tasks, or a detailed prompt for non-coding tasks.
- Do NOT wrap JSON in markdown code fences.
`;

async function generateChallenge({ skill, difficulty, style, context }) {
  const userPrompt = `
Generate a "${style}" style challenge for a "${difficulty}" level candidate with the skill track: "${skill}".
${context ? `Additional context: ${context}` : ''}

The challenge should feel like a real task from a ${skill}-focused job. Make the starter_code genuinely broken or incomplete — not just a comment.
`;
  return callGemini(CHALLENGE_SYSTEM_PROMPT, userPrompt);
}

// ─────────────────────────────────────────────
// 2. FOLLOW-UP QUESTION GENERATOR (Anti-Cheat)
// ─────────────────────────────────────────────
const FOLLOWUP_SYSTEM_PROMPT = `
You are an expert code reviewer conducting a live follow-up interview to verify a student truly understands their submitted code.
Analyze the student's code carefully and generate STRICT JSON — no markdown — matching this schema:

{
  "questions": ["string", "string"]
}

Rules:
- EXACTLY 2 questions.
- Each question must reference SPECIFIC lines, variable names, or logical choices in the submitted code.
- Questions must probe understanding (e.g. "Why did you use X instead of Y?", "What happens if the input is Z?").
- Do NOT ask generic questions. Make them impossible to answer without understanding this exact code.
`;

async function generateFollowUpQuestions({ challengeTitle, challengeProblem, studentCode }) {
  const userPrompt = `
Challenge: "${challengeTitle}"
Problem: "${challengeProblem}"

Student's submitted code:
\`\`\`
${studentCode}
\`\`\`

Generate 2 personalized follow-up questions that probe this student's understanding of their specific implementation.
`;
  return callGemini(FOLLOWUP_SYSTEM_PROMPT, userPrompt);
}

// ─────────────────────────────────────────────
// 3. SUBMISSION EVALUATOR (AI Scoring)
// ─────────────────────────────────────────────
const EVAL_SYSTEM_PROMPT = `
You are an expert technical interviewer evaluating a student's code submission AND their follow-up explanations.
Return STRICT JSON — no markdown — matching this schema:

{
  "ai_score": number (0-100),
  "reviewer_notes": "string — 2-4 sentence assessment of strengths and gaps",
  "verification_status": "AI Pre-Verified" | "Pending Review",
  "strengths": ["string"],
  "gaps": ["string"]
}

Rules:
- ai_score >= 80 → "AI Pre-Verified"; below 80 → "Pending Review"
- reviewer_notes must be specific to their code and explanations
- Be honest and constructive. Do NOT be generous — penalize vague explanations.
`;

async function evaluateSubmission({ challengeTitle, rubric, studentCode, followUpQuestions, followUpAnswers }) {
  const userPrompt = `
Challenge: "${challengeTitle}"
Rubric: ${JSON.stringify(rubric)}

Student Code:
\`\`\`
${studentCode}
\`\`\`

Follow-Up Q1: ${followUpQuestions[0]}
Student Answer 1: ${followUpAnswers[0] || '(no answer)'}

Follow-Up Q2: ${followUpQuestions[1]}
Student Answer 2: ${followUpAnswers[1] || '(no answer)'}

Evaluate the code AND the explanations together. Score the student 0-100.
`;
  return callGemini(EVAL_SYSTEM_PROMPT, userPrompt);
}

module.exports = { generateChallenge, generateFollowUpQuestions, evaluateSubmission };
