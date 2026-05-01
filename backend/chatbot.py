"""
TechStore AI Chatbot
====================
Rule-based chatbot with product-aware responses.
Optionally integrates with OpenAI when OPENAI_API_KEY is set.
"""

import os
import re
import json
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
import models

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ── Rule-based responses ──────────────────────────────────────────────────────

RULES = [
    # Greetings
    (r"\b(hello|hi|hey|salam|salem|қайда|сәлем)\b",
     "Сәлем! TechStore-ға қош келдіңіз! 👋 Компьютер бөлшектері бойынша сұрақтарыңызға жауап беруге дайынмын."),

    # Goodbye
    (r"\b(bye|goodbye|қош бол|сау бол)\b",
     "Сау болыңыз! TechStore-ды таңдағаныңызға рахмет! 🙏"),

    # Delivery
    (r"\b(delivery|жеткізу|доставка|shipping)\b",
     "📦 Жеткізу ақпараты:\n• Алматы: 1-2 жұмыс күні\n• Қазақстан бойынша: 3-5 жұмыс күні\n• Тегін жеткізу: 50,000 ₸ жоғары тапсырыстарда"),

    # Return policy
    (r"\b(return|қайтару|обмен|exchange|warranty|кепілдік)\b",
     "🔄 Қайтару саясаты:\n• 14 күн ішінде қайтаруға болады\n• Тауар бастапқы қаптамасында болуы керек\n• Кепілдік: өндіруші кепілдігіне сәйкес"),

    # Payment
    (r"\b(payment|төлем|оплата|card|карта|kaspi)\b",
     "💳 Төлем тәсілдері:\n• Kaspi Pay\n• Visa / Mastercard\n• Қолма-қол ақша\n• Kaspi бөліп төлеу (0-12 ай)"),

    # Contact
    (r"\b(contact|байланыс|телефон|phone|email)\b",
     "📞 Байланыс:\n• Телефон: +7 (727) 123-45-67\n• Email: support@techstore.kz\n• Жұмыс уақыты: Дүйсенбі-Жексенбі 09:00-21:00"),

    # Laptop
    (r"\b(laptop|ноутбук|notebook)\b",
     "💻 Ноутбуктар бөліміне өтіңіз. Бізде ASUS, Lenovo, HP, Dell брендтері бар. Бюджетіңізді айтсаңыз, ең қолайлы нұсқаны ұсынамын!"),

    # GPU
    (r"\b(gpu|видеокарта|graphics|rtx|rx\s*\d+)\b",
     "🎮 Видеокарталар: NVIDIA RTX 4070, AMD Radeon RX 7800 XT және басқалары бар. Ойын немесе жұмыс үшін қажет пе?"),

    # CPU / Processor
    (r"\b(cpu|процессор|processor|ryzen|intel|i[3579]-\d+)\b",
     "⚙️ Процессорлар: AMD Ryzen және Intel Core сериялары бар. Бюджет пен мақсатыңызды айтыңыз — дұрыс таңдауға көмектесемін!"),

    # RAM
    (r"\b(ram|жад|memory|ddr[45])\b",
     "🧠 Жад модульдері: DDR4 және DDR5, 8GB-тан 64GB-қа дейін. Қандай жүйеге қажет?"),

    # SSD / Storage
    (r"\b(ssd|hdd|storage|nvme|жад|диск)\b",
     "💾 Сақтау құрылғылары: Samsung, Kingston, WD брендтері. NVMe SSD ең жылдам нұсқа!"),

    # Price / Discount
    (r"\b(price|баға|цена|discount|жеңілдік|скидка|sale)\b",
     "🏷️ Ағымдағы акциялар мен бағаларды сайтта тікелей көруге болады. Белгілі бір тауардың бағасын білгіңіз келсе, атын айтыңыз!"),

    # Order status
    (r"\b(order|тапсырыс|заказ|status|жағдай)\b",
     "📋 Тапсырыс жағдайын тексеру үшін жеке кабинетіңізге кіріңіз немесе тапсырыс нөмірін support@techstore.kz-ге жіберіңіз."),
]

COMPILED_RULES = [(re.compile(pattern, re.IGNORECASE), response)
                  for pattern, response in RULES]

DEFAULT_RESPONSE = (
    "Сұрағыңызды түсінбедім 🤔 Мына тақырыптар бойынша көмектесе аламын:\n"
    "• Тауарлар (ноутбук, процессор, видеокарта, RAM, SSD)\n"
    "• Жеткізу және қайтару\n"
    "• Төлем тәсілдері\n"
    "• Байланыс ақпараты\n\n"
    "Немесе support@techstore.kz-ге жазыңыз."
)


# ── Product search helper ─────────────────────────────────────────────────────

def search_products(query: str, db: Session, limit: int = 3) -> list[dict]:
    """Search products by name or brand matching the query words."""
    words = [w for w in query.lower().split() if len(w) > 2]
    if not words:
        return []

    results = []
    for word in words:
        products = (
            db.query(models.Product)
            .filter(
                models.Product.is_active == True,
                (models.Product.name.ilike(f"%{word}%") |
                 models.Product.brand.ilike(f"%{word}%") |
                 models.Product.description.ilike(f"%{word}%"))
            )
            .limit(limit)
            .all()
        )
        for p in products:
            if not any(r["id"] == p.id for r in results):
                results.append({
                    "id": p.id,
                    "name": p.name,
                    "brand": p.brand,
                    "price": float(p.price),
                    "stock": p.stock_quantity,
                })
        if results:
            break

    return results[:limit]


def format_product_results(products: list[dict]) -> str:
    if not products:
        return ""
    lines = ["\n\n🛍️ <b>Табылған тауарлар:</b>"]
    for p in products:
        lines.append(
            f"• <b>{p['name']}</b> ({p['brand']}) — "
            f"{p['price']:,.0f} ₸"
            + (" ✅ Қолда бар" if p["stock"] > 0 else " ❌ Жоқ")
        )
    return "\n".join(lines)


# ── Main chatbot function ─────────────────────────────────────────────────────

async def get_chatbot_response(
    message: str,
    db: Optional[Session] = None,
    use_ai: bool = True,
) -> dict:
    """
    Return a chatbot response for the given user message.

    Priority:
    1. OpenAI (if configured and use_ai=True)
    2. Rule-based matching
    3. Product search
    4. Default fallback
    """
    message = message.strip()
    if not message:
        return {"response": "Сұрағыңызды жазыңыз.", "source": "validation"}

    # 1. Try OpenAI
    if use_ai and OPENAI_API_KEY:
        try:
            response_text = await _openai_response(message, db)
            if response_text:
                return {"response": response_text, "source": "openai"}
        except Exception as e:
            logger.warning(f"OpenAI call failed, falling back to rules: {e}")

    # 2. Rule-based matching
    for pattern, response in COMPILED_RULES:
        if pattern.search(message):
            # Append product results if DB is available
            extra = ""
            if db:
                products = search_products(message, db)
                extra = format_product_results(products)
            return {"response": response + extra, "source": "rules"}

    # 3. Product search fallback
    if db:
        products = search_products(message, db)
        if products:
            product_text = format_product_results(products)
            return {
                "response": f"Іздеуіңіз бойынша нәтижелер:{product_text}",
                "source": "product_search",
            }

    # 4. Default
    return {"response": DEFAULT_RESPONSE, "source": "default"}


async def _openai_response(message: str, db: Optional[Session]) -> Optional[str]:
    """Call OpenAI Chat Completions API."""
    try:
        import httpx

        # Build product context
        product_context = ""
        if db:
            products = search_products(message, db, limit=5)
            if products:
                product_context = "\n\nRelevant products in our catalog:\n" + "\n".join(
                    f"- {p['name']} ({p['brand']}): {p['price']:,.0f} KZT, "
                    f"{'in stock' if p['stock'] > 0 else 'out of stock'}"
                    for p in products
                )

        system_prompt = (
            "You are a helpful customer support assistant for TechStore, "
            "a computer hardware e-commerce store in Kazakhstan. "
            "Respond in the same language the user writes in (Kazakh, Russian, or English). "
            "Be concise, friendly, and helpful. "
            "Focus on computer hardware, delivery, payments, and store policies."
            + product_context
        )

        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message},
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        return None
