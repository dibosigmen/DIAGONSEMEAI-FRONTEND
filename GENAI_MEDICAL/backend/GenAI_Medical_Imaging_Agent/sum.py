

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

def summarize_text(text, num_sentences=3):
    """
    Summarize the input text using the LSA summarizer from sumy.
    Args:
        text (str): The text to summarize. Data coming will be summarized in bullet points.
        num_sentences (int): Number of sentences in the summary.
    Returns:
        str: The summary as a string.
    """
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, num_sentences)
    return " ".join(str(sentence) for sentence in summary)


if __name__ == "__main__":
    from fastapi import FastAPI
    import uvicorn

    app = FastAPI(title="DiagnosMe AI AI Backend")

    @app.post("/api/summarize")
    async def summarize_endpoint(data: dict):
        """
        Summarize the input text.
        Expected JSON:
        {
            "text": "Your long text to summarize goes here."
        }
        """
        text = data.get("text", "")
        if not text:
            return {"error": "No text provided for summarization."}

        try:
            summary = summarize_text(text)
            return {"summary": summary}
        except Exception as e:
            print("Summary error:", e)
            return {"error": "Summary failed."}

    uvicorn.run(app, host="0.0.0.0", port=8001)

        