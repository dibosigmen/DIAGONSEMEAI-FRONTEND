import io
import base64
import json
import requests
from PIL import Image
from openai import OpenAI

# =========================
# CONFIG
# =========================


OPENROUTER_API_KEY = "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"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

GROQ_API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"

openrouter_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL
) 

# =========================
# TEXT CHAT (MEDICAL BOT)
# =========================

def groq_chat(question: str):
    print("🟡 groq_chat called with:", question)

    prompt = f"""
You are an advanced medical AI assistant.
Respond ONLY in valid JSON.

Required keys:
bot_analysis, medicines, exercises, lifestyle_advice, severity, referral_needed, diet_chart

Structure:
{{
  "bot_analysis": "short explanation",
  "medicines": [
    {{"name": "medicine name", "dose": "dosage", "purpose": "reason"}}
  ],
  "exercises": [
    {{"name": "exercise name", "duration": "time"}}
  ],
  "lifestyle_advice": [
    {{"tip": "advice"}}
  ],
  "severity": "low | medium | high",
  "referral_needed": true | false,
  "diet_chart": {{
    "Monday": [
      {{"meal": "food suggestion"}}
    ],
    "Tuesday": [
      {{"meal": "food suggestion"}}
    ],
    "Wednesday": [
      {{"meal": "food suggestion"}}
    ],
    "Thursday": [
      {{"meal": "food suggestion"}}
    ],
    "Friday": [
      {{"meal": "food suggestion"}}
    ],
    "Saturday": [
      {{"meal": "food suggestion"}}
    ],
    "Sunday": [
      {{"meal": "food suggestion"}}
    ]
  }}
}}

Rules:
- Never return null
- Never return "None"
- Always give at least one medicine, exercise, and lifestyle tip
- Referral needed or not depending condition of the patient and type of disease patient has
- Generate a diet chart from Monday to Sunday with appropriate food suggestions for the patient’s condition
User question:
{question}
"""

    try:
        res = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 800,
                "temperature": 0.2
            },
            timeout=30
        )
    except Exception as e:
        print("🔴 REQUEST ERROR:", e)
        return _fallback(str(e))

    print("🟡 Groq status:", res.status_code)
    print("🟡 Groq raw response:", res.text)

    if res.status_code != 200:
        return _fallback(res.text)

    data = res.json()

    if "choices" not in data:
        return _fallback(data)

    content = data["choices"][0]["message"]["content"]
    print("🟢 Groq content:", content)

    try:
        return json.loads(content)
    except Exception:
        # Return raw text instead of failing
        return {
            "bot_analysis": content,
            "medicines": "None",
            "exercises": "None",
            "lifestyle_advice": "None",
            "severity": "low",
            "referral_needed": False
        }

def _fallback(error):
    return {
        "bot_analysis": "AI service error. Check backend logs.",
        "medicines": "None",
        "exercises": "None",
        "lifestyle_advice": "None",
        "severity": "low",
        "referral_needed": False,
        "debug": str(error)
    }

# =========================
# IMAGE ANALYSIS
# =========================

def analyze_image(image_bytes: bytes):

    # Convert image to PNG base64
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_base64 = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()

    # Medical-safe structured prompt
    prompt = """
You are a board-certified senior radiologist.

Carefully analyze this chest X-ray image.

Generate output in the following structured format:

-----------------------------
PROFESSIONAL RADIOLOGY REPORT
-----------------------------
Examination:
Findings:
- Lungs:
- Heart:
- Mediastinum:
- Bones:
- Soft Tissues:

Impression:
(Short, accurate, non-exaggerated conclusion.)
Only describe clearly visible findings.
If no clear abnormality is seen, state:
'No obvious acute cardiopulmonary abnormality detected on this image.'

--------------------------------
SUMMARY FOR DOCTOR (3-5 lines)
--------------------------------
Provide concise clinical interpretation.
Recommend CT only if clearly indicated.

--------------------------------
SIMPLE EXPLANATION FOR PATIENT
--------------------------------
Explain findings in very simple, non-technical language.
Do NOT mention cancer or serious disease unless clearly obvious.
Reassure if image appears normal.

IMPORTANT RULES:
- Do not invent nodules, masses, or diseases.
- Do not overdiagnose.
- Base conclusions only on visible evidence.
- This is not a definitive diagnosis.
Keep the report concise and realistic.
"""

    try:
        completion = openrouter_client.chat.completions.create(
            model="nvidia/nemotron-nano-12b-v2-v1:free",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": img_base64}}
                    ]
                }
            ],
            max_tokens=900,
            temperature=0.2  # lower temperature = more factual, less hallucination
        )

        return completion.choices[0].message.content

    except Exception as e:
        return f"Error analyzing image: {str(e)}"
# =========================
# REPORT ANALYSIS
# =========================

def report(file_bytes: bytes, file_type="image"):
    """
    file_type:
        - "image" -> X-ray, MRI, CT, ultrasound scan images
        - "pdf"   -> radiology report/prescription PDFs
    """

    # ----------------------------
    # Prepare input content
    # ----------------------------
    if file_type == "image":
        img = Image.open(io.BytesIO(file_bytes))
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")

        content = [
            {"type": "text", "text": "Analyze this radiology image."},
            {
                "type": "image_url",
                "image_url": {
                    "url": "data:image/png;base64," +
                    base64.b64encode(buffer.getvalue()).decode()
                },
            },
        ]

    elif file_type == "pdf":
        pdf_base64 = base64.b64encode(file_bytes).decode()

        content = [
            {"type": "text", "text": "Analyze this radiology PDF report."},
            {
                "type": "file",
                "file": {
                    "filename": "radiology.pdf",
                    "file_data": f"data:application/pdf;base64,{pdf_base64}",
                },
            },
        ]

    else:
        raise ValueError("Unsupported file type")

    # ----------------------------
    # AI Radiology Analysis
    # ----------------------------
    completion = openrouter_client.chat.completions.create(
        model="nvidia/nemotron-nano-12b-v2-v1:free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior radiologist.\n"
                    "ONLY analyze radiology-related documents:\n"
                    "- X-rays\n"
                    "- MRI\n"
                    "- CT scans\n"
                    "- Ultrasound\n"
                    "- PET scans\n"
                    "- Radiology prescriptions\n"
                    "- Radiology reports\n\n"
                    "DO NOT analyze:\n"
                    "- Blood test reports\n"
                    "- Lab reports\n"
                    "- Pathology reports\n"
                    "- General prescriptions\n\n"
                    "If not radiology, reply EXACTLY:\n"
                    "'This is not a radiology report.'\n\n"
                    "Output STRICTLY in this format:\n\n"
                    "Findings:\n"
                    "Impression:\n"
                    "Recommendations:\n"
                ),
            },
            {
                "role": "user",
                "content": content,
            },
        ],
        max_tokens=900,
    )

    return completion.choices[0].message.content

def report2(file_bytes: bytes, file_type="image"):
    """
    file_type:
        - "image" -> lab-reports, pathology reports, blood test reports, general prescriptions
        - "pdf"   -> radiology report/prescription PDFs
    """

    # ----------------------------
    # Prepare input content
    # ----------------------------
    if file_type == "image":
        img = Image.open(io.BytesIO(file_bytes))
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")

        content = [
            {"type": "text", "text": "Analyze this radiology image."},
            {
                "type": "image_url",
                "image_url": {
                    "url": "data:image/png;base64," +
                    base64.b64encode(buffer.getvalue()).decode()
                },
            },
        ]

    elif file_type == "pdf":
        pdf_base64 = base64.b64encode(file_bytes).decode()

        content = [
            {"type": "text", "text": "Analyze this radiology PDF report."},
            {
                "type": "file",
                "file": {
                    "filename": "radiology.pdf",
                    "file_data": f"data:application/pdf;base64,{pdf_base64}",
                },
            },
        ]

    else:
        raise ValueError("Unsupported file type")

    # ----------------------------
    # AI Radiology Analysis
    # ----------------------------
    completion = openrouter_client.chat.completions.create(
        model="google/gemma-3-12b-it:free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior radiologist.\n"
                    "ONLY analyze radiology-related documents:\n"
                    "- X-rays\n"
                    "- MRI\n"
                    "- CT scans\n"
                    "- Ultrasound\n"
                    "- PET scans\n"
                    "- Radiology prescriptions\n"
                    "- Radiology reports\n\n"
                    "DO NOT analyze:\n"
                    "- Blood test reports\n"
                    "- Lab reports\n"
                    "- Pathology reports\n"
                    "- General prescriptions\n\n"
                    "If not radiology, reply EXACTLY:\n"
                    "'This is not a radiology report.'\n\n"
                    "Output STRICTLY in this format:\n\n"
                    "Findings:\n"
                    "Impression:\n"
                    "Recommendations:\n"
                ),
            },
            {
                "role": "user",
                "content": content,
            },
        ],
        max_tokens=900,
    )

    return completion.choices[0].message.content