const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

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
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}


export async function generateQuestions({ jobTitle, company, jobDescription }) {
  const prompt = `You are an expert interviewer.
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


export async function evaluateAnswer({ question, answer }) {
    const prompt = `You are a fair but discerning interview evaluator. Score the answer from 0 to 100.

Judge by what the question calls for:
- Technical questions: accuracy, depth, correct reasoning.
- Behavioral/situational questions: relevant real experience, clear structure (situation → action → result), sound judgment. Do NOT require technical content for these.

Rubric: Relevance & substance 40% | Clarity & structure 30% | Specific detail/examples 30%.

Scoring scale:
- 0-20: empty, off-topic, or generic filler that echoes rubric words without real content.
- 30-50: on-topic but vague or shallow.
- 60-79: solid, clear, relevant answer with some specifics.
- 80-100: excellent — specific, well-structured, complete.

Reward genuinely good answers. Only score below 30 for vague, off-topic, or filler answers.

Question: ${question}
Candidate's answer: ${answer}

Return ONLY JSON: { "score": <integer 0-100>, "feedback": "1-2 sentences referencing what the answer actually said, plus one concrete way to improve and giving them ans in 1-2 lines" }`;

  const result = await callGroq(prompt, 0.2);

  const score = Math.min(100, Math.max(0, Math.round(result.score)));
  return { score, feedback: result.feedback };
}