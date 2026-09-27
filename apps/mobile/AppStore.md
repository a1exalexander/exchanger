# Публікація в App Store

Уже налаштовано: team `C8L8G6WU6L`, automatic signing, bundle `ua.in.exchanger`, версія з `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` у `project.yml`, `Exchanger/Resources/PrivacyInfo.xcprivacy`, `ExportOptions.plist`, скрипт `release`, privacy policy `apps/web/public/privacy.html` (en) і `apps/web/public/uk/privacy.html` (uk).

## Перший реліз

1. **Xcode → Settings → Accounts → «+» → Apple ID.** Увійти акаунтом з Developer Program. Без цього archive падає з `No Accounts`.
2. **Задеплоїти web**, щоб https://exchanger.in.ua/privacy.html і https://exchanger.in.ua/uk/privacy.html відкривались (потрібні для App Store Connect).
3. **App Store Connect → Apps → «+» → New App:**
   - Platform: iOS
   - Name: `Exchanger — Currency Converter` (якщо зайнято — `UAH Exchanger`)
   - Primary Language: English (U.S.)
   - Bundle ID: `ua.in.exchanger` (зареєстрований автоматично першим archive)
   - SKU: `exchanger-ios`
   - User Access: Full Access
4. **Завантаження збірки.** Якщо archive вже є в `build/`:
   ```sh
   xcodebuild -exportArchive -archivePath build/Exchanger.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build -allowProvisioningUpdates
   ```
   Інакше `yarn workspace mobile release` (archive + upload). Або в Xcode: destination «Any iOS Device» → Product → Archive → Distribute App → App Store Connect → Upload. Через 5–30 хв збірка з'явиться в TestFlight.
5. **App Information:** категорія Finance, Content Rights: «does not contain third-party content» (курси — факти з публічних API).
6. **Pricing and Availability:** Free, усі країни.
7. **App Privacy:** Privacy Policy URL `https://exchanger.in.ua/privacy.html` (English); для локалізації Ukrainian — `https://exchanger.in.ua/uk/privacy.html`. Далі анкета (див. нижче).
8. **Age Rating:** на всі питання «No / None» → 4+.
9. **Сторінка версії 1.0.0** спочатку English (основна), потім додати Ukrainian через меню мов праворуч угорі: тексти й скріншоти нижче, Build → вибрати завантажену збірку, Review Notes, Contact Info. Sign-in required: No.
10. **Add for Review → Submit.** Рев'ю зазвичай 1–3 дні. Version Release: Automatically або Manually.

## Скріншоти

Згенеровані 1320×2868 (6.9"), лежать у `build/screenshots/{en,uk}/` (не в git). Перезняти:
```sh
xcrun simctl boot "iPhone 18 Pro Max"
# зібрати й встановити Debug, далі для кожного екрана:
xcrun simctl launch booted ua.in.exchanger -debugFixtures YES -AppleLanguages "(uk)" [-debugSheet picker|settings]
xcrun simctl io booted screenshot 1-main.png
```

## Анкета App Privacy

- Do you collect data? **Yes**.
- **Usage Data → Product Interaction**: Analytics; linked to user: No; tracking: No.
- **Identifiers → Device ID**: Analytics; linked to user: No; tracking: No. (Анонімний ID PostHog, не IDFA.)
- Більше нічого не відмічати.

## Тексти

### English (основна мова)

**Name** (≤30): `Exchanger — Currency Converter`

**Subtitle** (≤30): `Monobank, NBU & market rates`

**Promotional Text:**
Convert Ukrainian hryvnia, dollars, euros and 200+ currencies and cryptocurrencies at Monobank, NBU or mid-market rates.

**Description:**
```
Exchanger is a fast currency converter built for Ukraine.

• Monobank buy and sell rates
• Official National Bank of Ukraine rate
• Mid-market rates for 200+ currencies and cryptocurrencies
• Quick picks for the currencies you use most
• Search by code, name or country
• Works offline with the last downloaded rates
• Light and dark themes

No sign-up, no ads.

Rates are for reference only.
```

**Keywords** (≤100): `hryvnia,uah,usd,eur,pln,exchange,rate,nbu,monobank,ukraine,crypto,bitcoin,money,forex,fx`

### Українська (локалізація)

**Name** (≤30): `Exchanger — конвертер валют`

**Subtitle** (≤30): `Курс Monobank, НБУ і ринку`

**Promotional Text:**
Конвертуйте гривню, долар, євро та ще понад 200 валют і криптовалют за курсом Monobank, НБУ або ринковим курсом.

**Description:**
```
Exchanger — швидкий конвертер валют для України.

• Курс купівлі та продажу Monobank
• Офіційний курс Національного банку України
• Ринковий курс для понад 200 валют і криптовалют
• Швидкий вибір валют, якими ви користуєтесь найчастіше
• Пошук за кодом, назвою або країною
• Працює офлайн з останніми завантаженими курсами
• Світла й темна теми

Без реєстрації та реклами.

Курси мають довідковий характер.
```

**Keywords** (≤100): `гривня,долар,євро,злотий,курс,обмін,валюта,нбу,монобанк,крипта,біткоїн,uah,usd,eur,pln`

### Спільне

- Support URL: `https://exchanger.in.ua`
- Marketing URL: `https://exchanger.in.ua`
- Privacy Policy URL: en — `https://exchanger.in.ua/privacy.html`, uk — `https://exchanger.in.ua/uk/privacy.html`
- Copyright: `2026 Oleksandr Ratushnyi`

**Review Notes** (App Review Information → Notes; той самий текст — відповідь на запит Guideline 2.1 «Information Needed»). Перед відправкою вписати модель iPhone і версію iOS:
```
1. Screen recording
Attached: recorded on iPhone [model], iOS [version], starting from app launch. The app has no account registration/login (so no account deletion), no user-generated content, and no paid content or In-App Purchases.

2. Purpose and target audience
Exchanger is a free currency converter for people in Ukraine and Ukrainians abroad who need to quickly check how much an amount is worth in another currency. It shows, side by side, Monobank's buy/sell rates (the rates most Ukrainians actually get when paying by card), the official National Bank of Ukraine rate, and mid-market rates for 200+ currencies and cryptocurrencies. It works offline with the last downloaded rates. The app is informational only: it does not exchange money, hold funds, or perform any financial transactions.

3. How to use
No login, demo account, or sample files are required. Open the app, type an amount on the keypad, and pick the currencies at the top (tap a currency to search by code, name, or country). Swipe the rate cards to switch between Monobank, NBU, and mid-market rates. Settings (gear icon) contains theme, language, data sources, and app info.

4. External services
- Monobank public API (api.monobank.ua/bank/currency): public exchange rates, no authentication
- National Bank of Ukraine open data API (bank.gov.ua): official exchange rates
- fawazahmed0/exchange-api (via cdn.jsdelivr.net / currency-api.pages.dev): open-source mid-market rates
- exchanger.in.ua/api/currencies: our own backend that caches and combines the above
- PostHog (eu.posthog.com): anonymous product analytics, not linked to identity, no tracking/IDFA
No authentication, payment, or AI services are used.

5. Regional differences
The app functions identically in all regions. Content does not depend on the user's location. The UI is available in English and Ukrainian.

6. Regulated industry / third-party material
The app does not provide financial services. It does not exchange currency, give investment advice, or process payments, so it requires no financial license. All rates are publicly available data from the official public APIs listed above and are shown with source attribution and a "rates are for reference only" disclaimer. The app is not affiliated with Monobank or the National Bank of Ukraine.
```

## Запис екрана для App Review

Apple вимагає для нових акаунтів (Guideline 2.1). Знімати на фізичному iPhone з останньою iOS, збірка з TestFlight — та сама, що на рев'ю. Control Center → Screen Recording; запис починається з домашнього екрана і натискання на іконку. Показати (1–2 хв):

1. Запуск і головний екран конвертера.
2. Введення суми на клавіатурі, перерахунок.
3. Перемикання курсів Monobank / НБУ / ринковий у каруселі.
4. Quick picks і вибір валюти через пошук (код, назва, країна).
5. Settings: тема, мова, джерела даних, дисклеймер.
6. Офлайн: авіарежим → перезапуск → працюють останні завантажені курси.

Прикріпити у відповідь в App Store Connect (App Review → Reply) разом із текстом Review Notes.

Якщо Apple причепиться до «Monobank» як чужої торгової марки (5.2.1 / 2.3.7) — прибрати з Keywords і змінити Subtitle, напр. на `Bank, NBU & market rates`.

## Наступні версії

1. У `project.yml` підняти `MARKETING_VERSION` (напр. `1.0.1`) і завжди підняти `CURRENT_PROJECT_VERSION` (кожен upload потребує нового номера збірки).
2. `yarn workspace mobile release`.
3. App Store Connect → «+ Version» → What's New, вибрати збірку → Submit.
