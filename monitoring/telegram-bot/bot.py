"""
TechStore Telegram Alert Bot
Receives webhook calls from Alertmanager and forwards them to Telegram.
"""

import os
import json
import logging
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="TechStore Alert Bot", version="1.0.0")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

SEVERITY_EMOJI = {
    "critical": "🔴",
    "warning":  "🟡",
    "info":     "🔵",
}

STATUS_EMOJI = {
    "firing":   "🚨",
    "resolved": "✅",
}


async def send_telegram_message(text: str) -> bool:
    """Send a message to the configured Telegram chat."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram credentials not configured — skipping send")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            logger.info("Telegram message sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False


def format_alert(alert: dict) -> str:
    """Format a single Alertmanager alert into a readable Telegram message."""
    status = alert.get("status", "unknown")
    labels = alert.get("labels", {})
    annotations = alert.get("annotations", {})

    severity = labels.get("severity", "info")
    service = labels.get("service", "unknown")
    alertname = labels.get("alertname", "Unknown Alert")

    status_icon = STATUS_EMOJI.get(status, "❓")
    severity_icon = SEVERITY_EMOJI.get(severity, "⚪")

    summary = annotations.get("summary", alertname)
    description = annotations.get("description", "No description provided.")

    # Format timestamps
    starts_at = alert.get("startsAt", "")
    if starts_at:
        try:
            dt = datetime.fromisoformat(starts_at.replace("Z", "+00:00"))
            starts_at = dt.strftime("%Y-%m-%d %H:%M UTC")
        except Exception:
            pass

    lines = [
        f"{status_icon} <b>TechStore Alert</b>",
        f"",
        f"{severity_icon} <b>Severity:</b> {severity.upper()}",
        f"📌 <b>Alert:</b> {summary}",
        f"🔧 <b>Service:</b> {service}",
        f"📝 <b>Details:</b> {description}",
    ]

    if starts_at:
        lines.append(f"🕐 <b>Time:</b> {starts_at}")

    if status == "resolved":
        lines.insert(1, "")
        lines.insert(1, "✅ <i>This alert has been resolved.</i>")

    return "\n".join(lines)


@app.post("/alert")
async def receive_alert(request: Request):
    """Receive Alertmanager webhook and forward to Telegram."""
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    alerts = body.get("alerts", [])
    if not alerts:
        return {"status": "no alerts to process"}

    logger.info(f"Received {len(alerts)} alert(s) from Alertmanager")

    results = []
    for alert in alerts:
        message = format_alert(alert)
        success = await send_telegram_message(message)
        results.append({"alert": alert.get("labels", {}).get("alertname"), "sent": success})

    return {"status": "processed", "results": results}


@app.get("/health")
def health():
    configured = bool(TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)
    return {
        "status": "healthy",
        "telegram_configured": configured,
    }


@app.get("/test")
async def test_alert():
    """Send a test message to verify Telegram integration."""
    message = (
        "🧪 <b>TechStore Alert Bot — Test</b>\n\n"
        "✅ Telegram integration is working correctly!\n"
        f"🕐 Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
    )
    success = await send_telegram_message(message)
    return {"sent": success, "configured": bool(TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)}
