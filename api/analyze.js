export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resume, jd } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const promptText = `You are a Lead Corporate Recruiter and ATS Expert. Analyze this Resume against the Job Description (JD). 
  Provide a strict, professional evaluation structured in three parts: 
  1. ATS MATCH SCORE (Out of 100) 
  2. TOP 3 CRITICAL SKILL GAPS 
  3. RESUME BULLET POINT FIX (Before & After format).
  
  Resume: ${resume}
  JD: ${jd}`;

  try {
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ result: aiText });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to communicate with AI engine' });
  }
}
