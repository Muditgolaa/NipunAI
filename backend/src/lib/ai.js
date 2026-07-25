const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// Shared helper: sends a prompt to Groq and returns parsed JSON.
async function callGroq(prompt, temperature) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      response_format: { type: "json_object" }, // force pure JSON output
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content); // safe because response_format guarantees JSON
}

// 1) Generate 8 role-specific questions. Temperature 0.7 → some variety is good.
export async function generateQuestions({ jobTitle, company, jobDescription }) {
  const prompt = `You are an expert technical interviewer.
Generate exactly 8 interview questions for this role.
Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

Mix exactly: 3 technical, 2 behavioral, 2 system_design, 1 situational.
Each question must have a "difficulty" of "easy", "medium", or "hard".
Return ONLY JSON in this exact shape:
{ "questions": [ { "content": "...", "category": "technical", "difficulty": "medium" } ] }`;

  const result = await callGroq(prompt, 0.7);
  return result.questions;
}

// 2) Score one answer. Temperature 0.2 → consistency matters (same answer ≈ same score).
export async function evaluateAnswer({ question, answer }) {
  const prompt = `You are scoring a candidate's interview answer from 0 to 100.
Rubric:
- Correctness & depth: 40%
- Clarity & structure: 30%
- Practical examples: 30%

Question: ${question}
Answer: ${answer}

Return ONLY JSON: { "score": <integer 0-100>, "feedback": "2-3 sentences of specific, constructive feedback" }`;

  const result = await callGroq(prompt, 0.2);

  // Clamp defensively — never trust the model to stay in range.
  const score = Math.min(100, Math.max(0, Math.round(result.score)));
  return { score, feedback: result.feedback };
}