from fastapi import FastAPI, UploadFile, File
import json
from fastapi.middleware.cors import CORSMiddleware
from medical_service import groq_chat, analyze_image, report,report2

print("🔥 main.py loaded")

app = FastAPI(title="DiagnosMe AI AI Backend")

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # lock this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# CHAT ENDPOINT
# =========================
@app.post("/chat")
async def chat(data: dict):
    """
    Expected JSON:
    {
      "question": "I have chest pain and fever"
    }
    """
    reply = groq_chat(data["question"])
    return {"answer": reply}

# =========================
# IMAGE ANALYSIS
# =========================
@app.post("/api/image-analysis")
async def image_analysis(file: UploadFile = File(...)):
    """
    Upload X-ray / MRI / CT image
    """
    import sys
    try:
        image_bytes = await file.read()
        report = analyze_image(image_bytes)
        return {"report": report}
    except Exception as e:
        print("🔴 IMAGE ANALYSIS ERROR:", str(e), file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        from fastapi import Response
        return Response(
            content=json.dumps({"error": f"Image analysis failed: {str(e)}"}),
            status_code=500,
            media_type="application/json"
        )


@app.post("/api/report-analysis")
async def image_analysis(file: UploadFile = File(...)):
    """
    Upload X-ray / MRI / CT image
    """
    image_bytes = await file.read()
    report1 = report(image_bytes)
    return {"report": report1}


@app.post("/api/lab-analysis")
async def image_analysis(file: UploadFile = File(...)):
    """
    Upload X-ray / MRI / CT image
    """
    image_bytes = await file.read()
    report3 = report2(image_bytes)
    return {"report": report3}
