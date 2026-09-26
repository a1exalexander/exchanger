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

**Review Notes:**
```
No account or sign-in is required. Exchange rates come from public APIs: Monobank (api.monobank.ua), National Bank of Ukraine (bank.gov.ua) and fawazahmed0/exchange-api (mid-market rates). The app provides reference rates only; it does not perform any currency exchange or financial transactions.
```

## Наступні версії

1. У `project.yml` підняти `MARKETING_VERSION` (напр. `1.0.1`) і завжди підняти `CURRENT_PROJECT_VERSION` (кожен upload потребує нового номера збірки).
2. `yarn workspace mobile release`.
3. App Store Connect → «+ Version» → What's New, вибрати збірку → Submit.
