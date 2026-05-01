# TechStore жобасына үлес қосу

Жобаға үлес қосқыңыз келсе, мына нұсқауларды орындаңыз.

## Әзірлеу ортасын орнату

1. Репозиторийді fork жасаңыз
2. Өз компьютеріңізге клондаңыз:
```bash
git clone https://github.com/<your-username>/TechStore.git
cd TechStore
```

3. Жаңа branch жасаңыз:
```bash
git checkout -b feature/your-feature-name
```

4. Әзірлеу ортасын орнатыңыз:
```bash
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

## Код стандарттары

### Python (Backend)

- PEP 8 стандартын сақтаңыз
- Type hints қолданыңыз
- Docstrings жазыңыз
- Black форматтерін қолданыңыз

```python
def get_product(product_id: int) -> Product:
    """
    Тауарды ID бойынша алу.
    
    Args:
        product_id: Тауар идентификаторы
        
    Returns:
        Product объектісі
        
    Raises:
        HTTPException: Тауар табылмаса
    """
    pass
```

### JavaScript/React (Frontend)

- ESLint конфигурациясын сақтаңыз
- Functional components қолданыңыз
- Hooks дұрыс пайдаланыңыз
- Prettier форматтерін қолданыңыз

```javascript
/**
 * Тауар картасы компоненті
 * @param {Object} product - Тауар объектісі
 */
function ProductCard({ product }) {
  // Component logic
}
```

### Git Commit хабарламалары

Commit хабарламалары анық және сипаттамалы болуы керек:

```
feat: Себетке тауар қосу функциясын қосу
fix: Авторизация қатесін түзету
docs: README файлын жаңарту
style: Код форматтауды түзету
refactor: API клиентін қайта құру
test: Тауарлар API үшін тесттер қосу
chore: Dependencies жаңарту
```

## Pull Request процесі

1. Өзгерістерді commit жасаңыз:
```bash
git add .
git commit -m "feat: жаңа функция қосу"
```

2. Branch-ті push жасаңыз:
```bash
git push origin feature/your-feature-name
```

3. GitHub-та Pull Request жасаңыз

4. PR сипаттамасында:
   - Не өзгертілгенін жазыңыз
   - Неге қажет екенін түсіндіріңіз
   - Screenshot қосыңыз (UI өзгерістері үшін)
   - Байланысты issue-ді көрсетіңіз

## Тестілеу

Өзгерістерді жібермес бұрын тестілеңіз:

```bash
# Backend тестілеу
cd backend
pytest

# Frontend тестілеу
cd frontend
npm test

# Docker тестілеу
docker-compose up -d
# Қосымшаны браузерде тексеру
```

## Код шолу

- Барлық PR код шолудан өтеді
- Өзгерістер сұралуы мүмкін
- Конструктивті пікірлерге ашық болыңыз

## Жобаның құрылымы

```
TechStore/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── database/         # Database scripts
├── nginx/            # Nginx конфигурациясы
├── monitoring/       # Prometheus + Grafana
├── terraform/        # Infrastructure as Code
├── scripts/          # Utility scripts
└── docs/             # Құжаттама
```

## Жаңа функция қосу

1. Issue жасаңыз немесе бар issue-ді таңдаңыз
2. Feature branch жасаңыз
3. Функцияны әзірлеңіз
4. Тесттер жазыңыз
5. Құжаттаманы жаңартыңыз
6. PR жасаңыз

## Қате табу

Қате тапсаңыз:

1. GitHub Issues-те тексеріңіз (қайталанбас үшін)
2. Жаңа issue жасаңыз:
   - Қатенің сипаттамасы
   - Қайталау қадамдары
   - Күтілетін нәтиже
   - Нақты нәтиже
   - Скриншоттар/логтар

## Сұрақтар

Сұрақтарыңыз болса:
- GitHub Discussions қолданыңыз
- Issue жасаңыз "question" тегімен

## Лицензия

Үлес қосу арқылы сіз өз кодыңызды MIT лицензиясымен келісесіз.

## Алғыс

Жобаға үлес қосқаныңыз үшін рахмет! 🎉
