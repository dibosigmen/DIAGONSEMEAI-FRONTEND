import io
import os
import requests
import socketio
import uvicorn

from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client

try:
    import google.generativeai as genai
except ImportError as exc:
    raise ImportError(
        "Missing required package 'google-generativeai'. "
        "Install it with 'pip install google-generativeai' and avoid the generic 'google' PyPI package."
    ) from exc

from sum import summarize_text



GEMINI_API_KEY = "AIzaSyCF-1FASP6IjZXJ3kFdODZR15f8585vwSo"
GROQ_MODEL = "llama-3.1-8b-instant"
GROQ_API_KEY = "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"

SUPABASE_URL = "https://aehbmzwgsggwtznaxwci.supabase.co"
SUPABASE_KEY = "sb_publishable_TZxSFP7iMa4OI4h-7Ewzpg_KsOSsWg9"


genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-2.5-flash-lite")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

fastapi = FastAPI()

fastapi.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://rearrange-monday-underfoot.ngrok-free.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@fastapi.get("/")
async def root():
    return {"message": "Medical AI Server Running 🚀"}



def split_report(report: str):
    sections = {"findings": "", "impression": "", "summary": ""}
    current = None

    for line in report.split("\n"):
        line = line.strip()

        if "FINDINGS" in line.upper():
            current = "findings"
            continue
        elif "IMPRESSION" in line.upper():
            current = "impression"
            continue
        elif "SUMMARY" in line.upper():
            current = "summary"
            continue

        if current and line:
            sections[current] += line + "\n"

    return {k: v.strip() for k, v in sections.items()}


def analyze_image(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))

        response = model.generate_content(
            contents=[
                """
You are a board-certified radiologist.

Analyze the given medical image carefully.

STRICT FORMAT:

FINDINGS:
- Bullet point 1
- Bullet point 2
- Bullet point 3

IMPRESSION:
- Clinical interpretation (2-3 lines)

SUMMARY:
- Patient-friendly explanation (2 lines)

REPORT:
-REPORT OF WHOLE things with simple language without so much medical keywords just like human beinh wihat issue within him/she "
also extract the Name of patients,age and sex if found from the image
RULES:
- No extra text
- No markdown
- Only "-" bullets
- Keep it clean and professional


""",
                image
            ]
        )

        report = response.text if hasattr(response, "text") else str(response)

       
        report = report.replace("**", "").strip()

        structured = split_report(report)

        return {
            "report": report,
            "findings": structured["findings"],
            "impression": structured["impression"],
            "summary": structured["summary"]
        }

    except Exception as e:
        print("Gemini API error:", e)
        return {
            "report": f"Error: {e}",
            "findings": "",
            "impression": "",
            "summary": ""
        }


def analyze_image2(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))

        response = model.generate_content(
            contents=[
            
"""
You are a certified medical lab analyst.

Carefully analyze the provided lab report or medical document.

Follow this STRICT FORMAT exactly:

FINDINGS:

List key abnormal or important values (max 3 concise bullet points)
Include test names with high/low/normal interpretation

IMPRESSION:

Provide clinical interpretation in 2–3 lines
Mention possible condition or deficiency based on values

SUMMARY:

Explain results in simple, patient-friendly language (2 lines)

REPORT:

Provide a full explanation in simple human language
Explain what the results indicate about the patient’s health
Mention possible causes, risks, and general medical insights (no complex jargon)


PATIENT DETAILS:

Extract Name, Age, and Sex ONLY if clearly visible in the document
If not visible, write: Not available

MEDICAL HISTORY OF PATIENT:
Extract any relevant medical history mentioned in the document
If not mentioned, write: Not available
ALSO LEARN FROM THE IMAGE AND GIVE ME THE REPORT IN SIMPLE LANGUAGE WITH ALL THE DETAILS YOU CAN EXTRACT FROM THE IMAGE

SYMPOTOMS:
Extract any symptoms mentioned in the document
RULES:

Use only "-" bullet points
No markdown formatting
No extra text outside the sections
Keep output clean, structured, and professional
""",
                image
            ]
        )

        report = response.text if hasattr(response, "text") else str(response)

       
        report = report.replace("**", "").strip()

        structured = split_report(report)

        return {
            "report": report,
            "findings": structured["findings"],
            "impression": structured["impression"],
            "summary": structured["summary"],
            
        }

    except Exception as e:
        print("Gemini API error:", e)
        return {
            "report": f"Error: {e}",
            "findings": "",
            "impression": "",
            "summary": "",
            "medical_history": "",
            "symptoms": ""
        }
def analyze_image2(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))

        response = model.generate_content(
            contents=[
            
"""
You are a certified medical lab analyst.

Carefully analyze the provided lab report or medical document.

Follow this STRICT FORMAT exactly:

FINDINGS:

List key abnormal or important values (max 3 concise bullet points)
Include test names with high/low/normal interpretation

IMPRESSION:

Provide clinical interpretation in 2–3 lines
Mention possible condition or deficiency based on values

SUMMARY:

Explain results in simple, patient-friendly language (2 lines)

REPORT:

Provide a full explanation in simple human language
Explain what the results indicate about the patient’s health
Mention possible causes, risks, and general medical insights (no complex jargon)


PATIENT DETAILS:

Extract Name, Age, and Sex ONLY if clearly visible in the document
If not visible, write: Not available

MEDICAL HISTORY OF PATIENT:
Extract any relevant medical history mentioned in the document
If not mentioned, write: Not available
ALSO LEARN FROM THE IMAGE AND GIVE ME THE REPORT IN SIMPLE LANGUAGE WITH ALL THE DETAILS YOU CAN EXTRACT FROM THE IMAGE

SYMPOTOMS:
Extract any symptoms mentioned in the document
RULES:

Use only "-" bullet points
No markdown formatting
No extra text outside the sections
Keep output clean, structured, and professional
""",
                image
            ]
        )

        report = response.text if hasattr(response, "text") else str(response)

       
        report = report.replace("**", "").strip()

        structured = split_report(report)

        return {
            "report": report,
            "findings": structured["findings"],
            "impression": structured["impression"],
            "summary": structured["summary"],
            
        }

    except Exception as e:
        print("Gemini API error:", e)
        return {
            "report": f"Error: {e}",
            "findings": "",
            "impression": "",
            "summary": "",
            "medical_history": "",
            "symptoms": ""
        }

def chat():
    print("🤖 Groq Chatbot (type 'exit' to quit)\n")

    messages = [
        {"role": "system", "content": "You are a helpful AI assistant."}
    ]

    while True:
        user_input = input("You: ")

        if user_input.lower() == "exit":
            print("Bot: Goodbye 👋")
            break

        messages.append({"role": "user", "content": user_input})

        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": messages,
                    "temperature": 0.7
                }
            )
            data = response.json()
            bot_reply = data["choices"][0]["message"]["content"]
        except Exception as e:
            bot_reply = f"Error: {e}"

        print("Bot:", bot_reply)
        messages.append({"role": "assistant", "content": bot_reply})


if __name__ == "__main__":
    chat()
    


def body_image(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))

        response = model.generate_content(
            contents=[
                """
You are a certified medical analyst.

Carefully analyze the provided medical image. The image may be:
- A lab report
- A prescription
- A medical document
- A body/skin condition (cuts, wounds, rashes, redness, swelling, infections,all kinds disease,injuries,pimples etc all kind which can be dtected woith naked eye acta s  doctor)

Follow this STRICT FORMAT exactly:

FINDINGS:
- List key visible abnormalities or important observations (max 3 bullet points)
- Mention appearance (color, size, texture, inflammation, etc.)
- If lab report, include abnormal values with interpretation

IMPRESSION:
- Provide a short clinical interpretation (2–3 lines)
- Mention possible condition (infection, allergy, injury, deficiency, etc.)

SUMMARY:
- Explain in simple patient-friendly language (2 lines)

REPORT:
- Provide a detailed explanation in simple human language
- Describe what is visible in the image
- Explain possible causes (injury, allergy, infection, irritation, etc.)
- Mention risks and general medical insights
- Avoid complex jargon

PATIENT DETAILS:
- Extract Name, Age, Sex ONLY if clearly visible
- Otherwise: Not available

MEDICAL HISTORY OF PATIENT:
- Extract if mentioned
- Otherwise: Not available

SYMPTOMS:
- Extract symptoms if written in the document
- If image only, infer possible symptoms (pain, itching, burning, swelling)

RULES:
- Use only "-" bullet points
- No markdown formatting
- No extra text outside sections
- Keep output clean and professional
                """,
                image
            ]
        )

        report = response.text if hasattr(response, "text") else str(response)
        report = report.replace("**", "").strip()

        structured = split_report(report)

        return {
            "report": report,
            "findings": structured.get("findings", ""),
            "impression": structured.get("impression", ""),
            "summary": structured.get("summary", ""),
            "medical_history": structured.get("medical_history", ""),
            "symptoms": structured.get("symptoms", "")
        }

    except Exception as e:
        print("Gemini API error:", e)
        return {
            "report": f"Error: {e}",
            "findings": "",
            "impression": "",
            "summary": "",
            "medical_history": "",
            "symptoms": ""
        }



@fastapi.post("/api/image-analysis")
async def image_analysis(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return analyze_image(image_bytes)

@fastapi.post("/api/image-analysis2")
async def image_analysis2(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return analyze_image2(image_bytes)

@fastapi.post("/api/body_image")
async def body_image_endpoint(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return body_image(image_bytes)

from fastapi import Request

@fastapi.post("/api/chat")
async def chat_endpoint(request: Request):
    body = await request.json()
    question = body.get("question", "")
    mode = body.get("mode", "normal")

    # System prompt for structured JSON output
    system_prompt = (
        "You are a helpful and precise medical assistant AI. "
        "Always answer in the following JSON format, with no extra text or markdown:\n"
        '{\n'
        '  "bot_analysis": "A concise analysis of the user\'s symptoms or question.",\n'
        '  "medicines": [\n'
        '    {"name": "Medicine Name", "dose": "Dosage", "purpose": "Purpose of medicine"}\n'
        '  ],\n'
        '  "exercises": [\n'
        '    {"name": "Exercise Name", "duration": "Duration or frequency"}\n'
        '  ],\n'
        '  "lifestyle_advice": [\n'
        '    {"tip": "Lifestyle tip or advice"}\n'
        '  ]\n'
        '}\n'
        "If you don't know any field, use an empty string or empty array."
    )
    if mode == "summary":
        system_prompt = (
            "Summarize the user's medical question in simple terms and provide a brief, clear answer. "
            "Always answer in the following JSON format, with no extra text or markdown:\n"
            '{\n'
            '  "bot_analysis": "Summary of the question.",\n'
            '  "medicines": [],\n'
            '  "exercises": [],\n'
            '  "lifestyle_advice": []\n'
            '}\n'
        )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question}
    ]
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "temperature": 0.7
            }
        )
        data = response.json()
        bot_reply = data["choices"][0]["message"]["content"]
        # Try to parse the reply as JSON
        import json
        try:
            answer_json = json.loads(bot_reply)
        except Exception:
       
            answer_json = {
                "bot_analysis": bot_reply,
                "medicines": [],
                "exercises": [],
                "lifestyle_advice": []
            }
        return {"answer": answer_json}
    except Exception as e:
        return {"answer": {"bot_analysis": f"Error: {e}", "medicines": [], "exercises": [], "lifestyle_advice": []}}
    
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    ping_timeout=60,
    ping_interval=25
)

app = socketio.ASGIApp(sio, fastapi)



transcripts = {}
socket_room_map = {}
room_user_counts = {}
meeting_processed = {}


@sio.event
async def connect(sid, environ):
    print("User connected:", sid)


@sio.event
async def disconnect(sid):
    room_id = socket_room_map.get(sid)

    if not room_id:
        return

    await sio.emit("user-left", sid, room=room_id)

    room_user_counts[room_id] = max(room_user_counts.get(room_id, 1) - 1, 0)

    if room_user_counts[room_id] <= 0:
        await process_and_save_meeting(room_id)

    socket_room_map.pop(sid, None)


@sio.on("join-room")
async def join_room(sid, room_id):
    await sio.enter_room(sid, room_id)

    transcripts.setdefault(room_id, [])
    meeting_processed[room_id] = False

    socket_room_map[sid] = room_id
    room_user_counts[room_id] = room_user_counts.get(room_id, 0) + 1

    room = sio.manager.rooms["/"].get(room_id, {})
    clients = list(room)

    await sio.emit("all-users", [c for c in clients if c != sid], to=sid)
    await sio.emit("user-joined", sid, room=room_id)


@sio.event
async def signal(sid, data):
    await sio.emit(
        "signal",
        {"from": sid, "signal": data["signal"]},
        to=data["target"]
    )


@sio.event
async def transcript(sid, data):
    room_id = data.get("roomId")
    text = data.get("text", "").strip()

    if not room_id or not text:
        return

    transcripts.setdefault(room_id, []).append(text)
    await sio.emit("transcript-update", transcripts[room_id], room=room_id)



def generate_summary(text):
    if not text.strip():
        return "No speech recorded."

    try:
        res = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": "Summarize in bullet points."},
                    {"role": "user", "content": text}
                ]
            }
        )

        data = res.json()
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("Summary error:", e)
        return "Summary failed."



async def process_and_save_meeting(room_id):
    if meeting_processed.get(room_id):
        return

    meeting_processed[room_id] = True

    text = " ".join(transcripts.get(room_id, []))

    if not text:
        return

    summary = generate_summary(text)

    meeting_code = "MEET0001"

    try:
        data = supabase.table("video_meetings") \
            .select("meeting_code") \
            .order("id", desc=True) \
            .limit(1) \
            .execute()

        if data.data:
            num = int(data.data[0]["meeting_code"].replace("MEET", "")) + 1
            meeting_code = f"MEET{num:04}"

    except Exception as e:
        print("Meeting code error:", e)

    supabase.table("video_meetings").insert({
        "meeting_code": meeting_code,
        "title": "Video Meeting",
        "conversation": text,
        "summarize": summary,
        "room_no": room_id
    }).execute()

    await sio.emit("meeting-summary", summary, room=room_id)

    transcripts.pop(room_id, None)
    room_user_counts.pop(room_id, None)



if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8002, reload=True)