# Thai marketplace APIs (Shopee · Lazada · TikTok Shop · LINE)

Use when building a system that pulls orders, deducts stock, or ships goods through a marketplace · use with [`inventory-management.md`](inventory-management.md) (multi-channel sync · stock reservation) · for sellers who do not program → `e-commerce:multi-shop-stock` (if installed)
Every fact comes from the provider's documentation, opened and checked 2026-10-23 (section "Sources") · a field that was searched for and not found is labeled (ยังไม่ได้ตรวจ) (not yet checked) · re-checked 2026-10-26 with a real browser (the Shopee · Lazada · TikTok Shop pages need scripts to run; no login is needed to see the docs)
Abbreviations: Application Programming Interface (API) · Independent Software Vendor (ISV) is a company that builds a system for many shops · Hash-based Message Authentication Code (HMAC) is a signature made from a secret key

## 1 · Build it yourself or use a ready-made system

- One shop that sells on several channels → an already-connected back-office system (item 7) is faster than building it yourself.
- Build it yourself when it is an Order Management System (OMS) or Enterprise Resource Planning (ERP) with many shop customers, or has business rules a ready-made system cannot do.
- Check eligibility before taking the job: a Thai shop that will use Shopee Open Platform itself must be a Mall Seller or Managed Seller.

## 2 · Sign-up and account types

| | Shopee Open Platform | Lazada Open Platform | TikTok Shop Partner Center |
|---|---|---|---|
| Types | Individual Seller · Registered Business Seller (own shop only) · Third-party Partner Platform (ISV) | Software Developer (calls the API of its own shop) · Service Provider (sells services to shops · cannot be changed once chosen) | Seller developer (custom app for its own shop) · App developer / ISV (public app) |
| An ISV needs | a registered company · a working product with a trial account that has every feature open · HTTPS URLs · Transport Layer Security (TLS) 1.2 or higher · security grade "A" | service name · 200×200 px logo · a payout account if selling in Service Market | a business certificate matching the registered region · a partner in a country picks its own market |
| Shop doing it itself | Thai shop: Mall Seller or Managed Seller | no Thai-specific condition found · the developer-role page (docId=108001, checked 2026-10-26) only says to register the Software Developer role and fill in the details · not checked with the Lazada team whether there are criteria outside the docs | shop already open · has an Account Manager · uses the same email as the shop account |

## 3 · Signature and permission from the shop

| | Shopee | Lazada | TikTok Shop |
|---|---|---|---|
| Signature | HMAC-SHA256 with the partner key of partner_id + api path + timestamp + access_token + shop_id · hex | sort the parameters in ASCII order and join name with value, prefix with the API name, append the body · HMAC-SHA256 with the app secret · uppercase hex | sort the query (excluding sign and access_token) and join, prefix with the path, append the body (except multipart), wrap with the app secret at both ends · HMAC-SHA256 |
| Time | timestamp valid for 5 minutes | timestamp differs from UTC time by at most 7200 seconds (2 hours · open.lazada.com, page of the GetSellerItemLimit API, checked 2026-10-26) | timestamp must be within 5 minutes of the time the platform receives it, 10-digit Unix (sign-your-api-request, checked 2026-10-26) |
| Shop authorizes | authorize link → `code`, single use, valid 10 minutes | OAuth 2.0 code-for-token at `auth.lazada.com` | `auth_code` valid 30 minutes, single use → `auth.tiktok-shops.com/api/v2/token/get` |
| access token | 4 hours · the old one works for 5 more minutes after refresh | the docs example is 864,000 seconds (10 days) | default 7 days · sent in the header `x-tts-access-token` |
| refresh token · permission lifetime | refresh 30 days · a shop can authorize for at most 365 days | example 4,320,000 seconds (50 days) · after that the shop must authorize again | equals the period the shop authorized |
| host | choose by server location · near Singapore use `https://partner.shopeemobile.com` | `https://api.lazada.co.th/rest` | `https://open-api.tiktokglobalshop.com` |

## 4 · Main endpoints

| Task | Shopee (Open API v2) | Lazada | TikTok Shop (the version is in the path · use the latest version the reference page shows) |
|---|---|---|---|
| Orders | `get_order_list` (`/api/v2/order/get_order_list` · date range at most 15 days) · `get_order_detail` · `cancel_order` | GetOrders (`/orders/get`) · GetOrder · GetOrderItems | Get Order List (`/order/202309/orders/search`) · Get Order Detail |
| Products | `add_item` · `get_item_list` · `get_item_base_info` · `get_model_list` | CreateProduct · GetProducts | Create Product · Search Products |
| Stock · price | `update_stock` · `update_price` | UpdatePriceQuantity · UpdateSellableQuantity | Update Inventory · Update Price |
| Shipping | `get_shipping_parameter` · `ship_order` · `get_tracking_number` · `create_shipping_document` | Pack · ReadyToShip · GetShipmentProvider · PrintAWB · GetOrderTrace | Ship Package · Batch Ship Packages · Get Package Shipping Document |

## 5 · Webhook · rate limit · sandbox

| | Shopee | Lazada | TikTok Shop |
|---|---|---|---|
| webhook | Push Mechanism: Order Status (code 3) · Order TrackingNo (4) · Reserved Stock Change (8) · Shop Authorization Canceled (2) · Authorization Expiry (12 · 7 days ahead) · reply 2xx · it only says the data changed; call the API to fetch the real data | Lazada Push Mechanism: trade order · reverse order (return · refund) · the callback must be HTTPS with an Organization Validation (OV) or Extended Validation (EV) certificate · Domain Validation (DV) level cannot be used | ORDER_STATUS_CHANGE · PACKAGE_UPDATE · PRODUCT_STATUS_CHANGE · SELLER_DEAUTHORIZATION · UPCOMING_AUTHORIZATION_EXPIRATION (30 days ahead, then every day) |
| verify the webhook | header `Authorization` = hex HMAC-SHA256 of the URL followed by `\|` then the body, with the partner key | header `Authorization` = hex HMAC-SHA256 of app_key + body with the app secret | header `Authorization` = lowercase hex HMAC-SHA256 of app_key + raw body with the app secret · de-duplicate with `tts_notification_id` |
| rate limit | no number found on developer-guide pages 12 · 16 and the FAQ opened 2026-10-26 (ยังไม่ได้ตรวจ · ask the Shopee team or test in the sandbox) | no overall cap · GetSellerItemLimit states 10 qps per shop · the GetOrders page gives no number · the push docs warn that calling GetOrders too often gets throttled | queries per second (QPS) adjusts dynamically with the number of authorized shops and the endpoint's load · no fixed overall value (rate-limits, checked 2026-10-26) · suggested starting point per app × shop: heavy writes 0.2–1 per second · normal writes 1–3 · reads 3–10 · light reads 5–20 · watch for 429 and 36009002 |
| sandbox | Sandbox V2 `https://openplatform.sandbox.test-stable.shopee.sg/` · can create test shops and orders · a test partner_id works only in the sandbox | borrow a test account · test orders are cash on delivery (COD) · 10 cases/day/app key · the live system means real shop data | Development Shops: Core Function (no real payment · advance order status with a tool) · Full Function (real payment at a low price) |

## 6 · LINE and PromptPay

- **LINE SHOPPING / MyShop is still open** (lineshoppingseller.com · open a shop free through a LINE Official Account) · the LINE SHOPPING API is open to platform partners only, and no public docs were found → a shop connects through a partner on the Partners page (about 20 in total, such as ZORT · BigSeller · BentoWeb · PEAK)
- **LINE Pay Thailand** uses the name "LINE Pay" (pay-th.line.me · a merchant applies and waits for review · accepts online payment through an API) · the technical help link goes to developers-pay.line.me: Online API v3 (`/v3/payments/request` · `confirm` · `refund`) · headers `X-LINE-ChannelId` · `X-LINE-Authorization-Nonce` · `X-LINE-Authorization` (HMAC-SHA256) · sandbox `sandbox-api-pay.line.me`
- The LINE Pay docs do not name Thailand, and the latest change log (Nov 2025) belongs to Taiwan · LINE Pay Japan has closed → confirm with LINE Pay Thailand before connecting directly (รอยืนยัน) · the easier way is to accept through a payment gateway (`fintech-payments`)
- PromptPay QR on the payment page → `e-commerce:promptpay-qr` (if installed)

## 7 · Back-office systems Thai sellers use instead of building their own

| System | From the vendor's website |
|---|---|
| ZORT | order and stock management system for every channel · has an API at `https://open-api.zortout.com/v4` (headers `storename` · `apikey` · `apisecret` · syncs products, purchase orders, orders) |
| BentoWeb | all-in-one e-commerce system · connects Lazada · Shopee · LINE Shopping · TikTok Shop · sends product, stock and order data into an ERP through an API |
| BigSeller | back-office system for products, orders, stock · has a free tier · connects more than 16 platforms such as Shopee · Lazada · TikTok Shop |

## 8 · Rules that apply to every provider

- A webhook is not the single source of truth → also poll to reconcile on a schedule (TikTok says so directly · Shopee says to call the API to fetch the real data)
- Verify the webhook signature before doing anything · reply 2xx at once, then continue the work in a queue (`background-jobs`)
- Prevent duplicate work with the notification id or order id (`principle-safe-to-rerun`)
- Store tokens per shop · refresh before they expire · warn the shop before the permission expires (Shopee 365 days · Lazada refresh 50 days · TikTok notifies 30 days ahead)
- Prevent overselling with reservation per [`inventory-management.md`](inventory-management.md) · keep the partner key and app secret outside the code (`config-and-secrets`)

## Sources

| Topic | URL (opened and checked 2026-10-23) |
|---|---|
| Shopee sign-up · Thai criteria · ISV | https://open.shopee.com/developer-guide/12 |
| Shopee host · signature · token | https://open.shopee.com/developer-guide/16 · https://open.shopee.com/developer-guide/20 |
| Shopee push · sandbox · endpoint | https://open.shopee.com/developer-guide/18 · https://open.shopee.com/developer-guide/644 · https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1 (the API list in the side bar) |
| Lazada signature · host · roles | https://open.lazada.com/apps/doc/doc?nodeId=10450&docId=108068 · ...docId=108065 · ...docId=108001 |
| Lazada shop permission · testing · push | ...nodeId=10777&docId=108260 · ...docId=121061 · ...nodeId=29524&docId=120168 · https://open.lazada.com/apps/doc/api?path=%2Forders%2Fget |
| TikTok Shop types · sign-up · token | https://partner.tiktokshop.com/docv2/page/tts-developer-types · .../developer-onboarding · .../authorization-overview-202407 |
| TikTok Shop signature · host · version · rate limit | .../sign-your-api-request · .../methods-and-endpoints · .../api-versioning · .../rate-limits · .../regions-and-languages |
| TikTok Shop webhook · sandbox · endpoint | .../tts-webhooks-overview · .../seller-center-development-shops · .../get-order-list-202309 |
| LINE SHOPPING · partners | https://lineshoppingseller.com/ · https://lineshoppingseller.com/new-features/partner-api |
| LINE Pay | https://pay-th.line.me/portal/th/main · .../business/payment-service · https://developers-pay.line.me/online-api-v3 · https://developers-pay.line.me/api-change-log |
| ZORT · BentoWeb · BigSeller | https://zortout.com/ · https://developers.zortout.com/ · https://www.bentoweb.com/th · https://www.bigseller.com/th_TH/index.htm |
