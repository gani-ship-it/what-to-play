# WHAT-TO-PLAY 🎮

> **Discover. Track. Never Miss a Deal.**

What-To-Play (WTP) is a modern **PC game discovery, deal tracking, price history, and personal game management platform**.

The goal is to help PC gamers discover games, compare legitimate store prices, find free games and major discounts, track upcoming/anticipated games, view game information, check PC compatibility, and receive notifications when games they care about become free or reach a desired price.

This is a **PC-focused V1 project**. Do not build Android functionality in V1.

---

# 1. CORE PRODUCT PHILOSOPHY

What-To-Play should NOT feel like a generic SaaS dashboard.

It should feel like a:

* Premium PC gaming platform
* Game discovery website
* Digital game library
* Deal tracker
* Personal gaming dashboard

The user should be able to **fully explore the website without creating an account**.

Authentication should only be required when the user performs an action that needs to be saved.

Examples:

* Wishlist ❤️
* Favourite ⭐
* Track Game 🔔
* Price Alert 💰
* Add to Library 📚
* Save PC Specifications 🖥️
* Personal notification settings

Do NOT force users to log in just to browse games.

---

# 2. DESIGN DIRECTION

## Visual Style

Use a:

* Black
* White
* Dark gray
* Red accent

color system.

The design should feel:

* Cinematic
* Premium
* Modern
* Mature
* Gaming-focused
* Professional

Avoid making the website look like:

* Generic SaaS
* Cryptocurrency dashboard
* Excessively neon cyberpunk
* AI-generated template
* Overly colorful gaming website

Use red primarily for:

* Important buttons
* Discount badges
* Active states
* Alerts
* Important highlights
* Small visual accents

Do not make the entire interface bright red.

---

# 3. PUBLIC / GUEST EXPERIENCE

Users who are not logged in should be able to access almost the entire website.

Guests can:

* Browse games
* Search games
* Filter games
* View game details
* View screenshots
* Watch official trailers
* View ratings
* View prices
* Compare stores
* View discounts
* View historical price information
* View free games
* View most popular games
* View most anticipated games
* View new releases
* View PC requirements
* Check PC compatibility
* View game popularity/player information

Authentication is only required for personalized actions.

---

# 4. AUTHENTICATION

Provide three authentication methods.

## Option 1 — Create WTP Account

Users can create a normal What-To-Play account using:

* Email
* Username
* Password

After signup:

1. Generate a secure 6-digit OTP.
2. Send OTP to the user's email.
3. User enters OTP.
4. Verify OTP.
5. Activate the account.

OTP requirements:

* 6 digits
* Expiration time
* Secure server-side storage
* Limited verification attempts
* Resend cooldown
* Rate limiting

Email verification should be required before the account becomes fully active.

## Option 2 — Continue with Google

Implement Google OAuth.

## Option 3 — Continue with Microsoft

Implement Microsoft OAuth.

---

# 5. UNIFIED ACCOUNT SYSTEM

Google, Microsoft, and normal WTP authentication should ultimately connect to the same WTP user system.

Do not unnecessarily create duplicate accounts.

The database should support linked authentication providers.

Example:

```text
WTP USER
│
├── Email/password
├── Google
└── Microsoft
```

The same user should retain:

* Wishlist
* Favourite games
* Library
* Price alerts
* PC specifications
* Notification settings
* Profile
* Preferences

regardless of the login method.

---

# 6. HOMEPAGE

The homepage should immediately communicate what WTP does.

Suggested hero:

> **Discover Your Next Game**
>
> Track prices. Find the best deals. Never miss a free game.

Homepage sections:

1. Hero
2. Free Games Right Now
3. Biggest Discounts
4. Most Popular Games
5. Most Anticipated Games
6. New Releases
7. Best Value Games
8. Games Your PC Can Run
9. Recently Added / Trending
10. Footer

---

# 7. GAME DISCOVERY

Users should be able to search and discover games.

Search by:

* Game name
* Genre
* Developer
* Publisher

Filters should include where appropriate:

* Genre
* Release date
* Price
* Discount
* Store
* Rating
* Platform
* Free / Paid
* Upcoming
* Popularity

Sorting:

* Popular
* Highest rated
* Biggest discount
* Lowest price
* Recently released
* Release date
* Most anticipated

---

# 8. GAME DETAILS PAGE

Every game should have a rich dedicated page.

Example structure:

```text
Hero / Background Artwork

Game Title
Genre
Developer
Publisher
Release Date
Rating

Current Price
Original Price
Discount

[Track Game]
[Wishlist]

Screenshots

Official Trailer

Where To Get It

Price History

Lowest Historical Price

Highest Historical Discount

Free Giveaway History

Popularity / Players

Ratings

PC Requirements

Can My PC Run This?

Description

Additional Game Information
```

---

# 9. GAME MEDIA

Every game should support:

## Cover Image

Used in:

* Game cards
* Search results
* Library
* Wishlist
* Game details

## Background / Hero Image

Used on the game details page.

## Screenshots

Display multiple screenshots for each game.

Support:

* Screenshot gallery
* Fullscreen viewing
* Previous/next navigation
* Responsive layout

Do not manually upload screenshots for every game if the selected game-data API provides them.

Use permitted image URLs/data according to the API's licensing requirements.

## Official Trailer

Where possible, show the game's **official trailer**.

Prefer:

* Developer channel
* Publisher channel
* Official game channel

Do not intentionally select random fan-made videos.

Use embedded video rather than downloading and hosting copyrighted trailers.

---

# 10. API / DATA SOURCES

The initial external data sources are:

## RAWG API

Use RAWG for game metadata such as:

* Game name
* Description
* Genres
* Release dates
* Platforms
* Developers
* Publishers
* Ratings
* Artwork
* Background images
* Screenshots
* Other game metadata

Respect RAWG API licensing and attribution requirements.

---

## CheapShark API

Use CheapShark for PC deal information.

Use it for:

* Current deals
* Store information
* Prices
* Original prices
* Discounts
* Deal links
* Historical deal information where available

Supported stores/data should be determined from actual API responses.

Do not assume every store has identical pricing.

Important:

**Prices are region-specific.**

Do not treat one global price as the price for every user.

---

## Steam Web API

Use Steam's official APIs where appropriate.

Primary V1 use:

* Current Steam player count

Store periodic player-count observations in our own database if historical charts are required.

Do not call Steam repeatedly for every page view if the information can be cached.

---

## YouTube Data API — Optional

Can be used to locate/verify official game trailers.

If trailer data is already available reliably, this API does not need to be used everywhere.

---

## IGDB — Later / Optional

IGDB can be considered later if RAWG does not provide sufficient metadata.

Do not add unnecessary APIs before identifying a real data gap.

---

## Currency API — Optional

Only use currency conversion when necessary.

If a store provides an actual regional price in the user's currency, prefer that price instead of converting another currency.

---

# 11. REGIONAL PRICING

Game prices can differ significantly between countries.

The database must therefore NOT store only:

```text
game_id
price
```

Instead, price observations should support:

```text
game_id
store_id
country
currency
price
original_price
discount_percent
recorded_at
offer_ends_at
```

Example:

```text
Game
│
├── Steam / India / INR / ₹1,499
├── Steam / USA / USD / $29.99
├── Steam / UK / GBP / £24.99
└── Steam / Germany / EUR / €29.99
```

The user should have a region setting.

Example:

```text
Region: India 🇮🇳
Currency: INR ₹
```

Allow the user to change region later.

Do not incorrectly display an Indian historical low to a US user.

Price history must be region-aware.

---

# 12. DEAL SYSTEM

The deal system is one of the core features of WTP.

Show:

* Current price
* Original price
* Discount percentage
* Store
* Best current deal
* Deal expiration
* Historical lowest price
* Highest historical discount
* Date of historical low
* Date of highest discount

Example:

```text
Cyberpunk 2077

Current:
₹1,049

Original:
₹2,999

Discount:
65% OFF

Best Current Deal:
Steam

Historical Low:
₹899

Highest Discount:
70%

Historical Low Date:
[date]
```

---

# 13. PRICE HISTORY

Never overwrite old price records.

Every important price observation should be stored as a historical record.

Example:

```text
₹2,999 → January
₹2,499 → February
₹1,799 → March
₹999   → April
₹1,499 → May
```

This allows WTP to calculate:

* Lowest price
* Highest discount
* Average price
* Price changes
* Historical charts

The price-history system must be **region + store aware**.

---

# 14. FREE GAME SYSTEM

Clearly distinguish between:

### FREE-TO-PLAY

A game that is permanently free to download/play.

### LIMITED-TIME FREE

A normally paid game temporarily available for free.

### PAID

Normal paid game.

### DISCOUNTED

Paid game currently on sale.

### BUNDLE

Game available through a bundle.

Do not incorrectly label permanently free games as limited-time giveaways.

---

# 15. FREE GIVEAWAY HISTORY

For games that become temporarily free, maintain giveaway history.

Store:

* Game
* Store
* Start date
* End date
* Original price
* Giveaway status
* Region where applicable
* Recorded timestamp

Example:

```text
Game: Example Game

FREE GIVEAWAY
Store: Epic
From: 10 March
Until: 17 March
Original Price: ₹1,499
```

This information should become more accurate as WTP collects historical data over time.

---

# 16. MOST POPULAR GAMES

Do NOT call this:

> Most Downloaded Games

unless an actual reliable download number is available.

Use:

> **Most Popular Games**

or:

> **Most Played Games**

Possible popularity metrics:

* Current Steam players
* Daily peak
* 7-day peak
* Reviews
* Review activity
* Recent popularity growth
* Store popularity where legitimately available

WTP may calculate its own popularity score.

Clearly label it:

> WTP Popularity Score

Do not pretend it is an official number.

---

# 17. PLAYER STATISTICS

Where reliable data is available, show:

* Current players
* 24-hour peak
* 7-day peak
* All-time peak if reliable
* Historical player chart

Important:

Steam's current player count is a snapshot.

If WTP wants historical player charts, periodically collect the current value and store it in our database.

Example:

```text
Steam
   ↓
Current Players
   ↓
WTP Background Job
   ↓
PostgreSQL
   ↓
Player History Chart
```

---

# 18. DOWNLOADS / OWNERS

Do not claim exact downloads or owners unless an official reliable source provides the number.

If third-party estimates are used later, label them clearly:

> Estimated Owners

Never present an estimate as an official number.

---

# 19. RATINGS

Possible rating sources:

* Steam user reviews
* RAWG rating
* Metacritic where legitimately available
* WTP Score

Do not mix ratings without identifying the source.

WTP can later calculate:

> **WTP Score: 8.7/10**

The WTP score should be clearly identified as WTP's own calculated score.

---

# 20. MOST ANTICIPATED GAMES

Create a dedicated section:

> **Most Anticipated Games**

This is different from:

* Most Popular
* New Releases

Most Anticipated = upcoming games people are excited about.

Game cards can show:

* Title
* Artwork
* Release date
* Expected release date
* Countdown
* Genre
* Developer
* Official trailer
* Community interest
* Track button

Possible future metric:

> WTP Anticipation Score

Do not falsely claim that this represents an official industry ranking.

---

# 21. PC REQUIREMENTS

Each game should provide:

### Minimum Requirements

* OS
* CPU
* RAM
* GPU
* VRAM if available
* Storage
* DirectX if available

### Recommended Requirements

* OS
* CPU
* RAM
* GPU
* VRAM if available
* Storage
* DirectX if available

---

# 22. PC COMPATIBILITY

Users should be able to save their PC specifications.

Example:

```text
My PC

CPU:
Intel Core 5 210H

GPU:
RTX 3050 Laptop GPU

VRAM:
4 GB

RAM:
16 GB

Storage:
512 GB

OS:
Windows 11
```

Then WTP compares the user's specifications with game requirements.

Use results such as:

* Likely compatible
* May run with compromises
* Likely below minimum requirements

Do NOT promise exact FPS.

Meeting minimum requirements does not guarantee a specific performance level.

---

# 23. AUTOMATIC PC DETECTION

For V1:

Allow manual entry of PC specifications.

Do not attempt to access restricted hardware information from the browser.

A browser cannot reliably obtain every exact hardware specification.

Future version:

Create a small Windows WTP PC Scanner application that can detect:

* CPU
* GPU
* VRAM
* RAM
* Storage
* Windows version

and securely send selected information to the user's WTP account.

This is NOT required for V1.

---

# 24. USER PROFILE

After login, users should have a personal dashboard.

Profile should contain:

* Profile picture
* Username
* Display name
* Bio
* Favorite game
* Favorite genres
* Account information

Dashboard statistics can include:

* Games in library
* Wishlist count
* Favourite games
* Active alerts
* Completed games

---

# 25. WISHLIST

Users can add games to their wishlist.

Guest behavior:

```text
Guest
 ↓
Click Wishlist ❤️
 ↓
Login / Signup modal
 ↓
Authentication
 ↓
Automatically add game
```

The user should NOT have to click Wishlist again after signing in.

Wishlist should store:

* Game
* Added date
* Current price
* User's target price
* Notification preference

---

# 26. PRICE ALERTS

Users can create personalized alerts.

Possible conditions:

### Free

> Notify me when this game becomes free.

### Discount

> Notify me when discount reaches 50%.

### Target price

> Notify me when price reaches ₹999 or below.

### Any deal

> Notify me whenever this game goes on sale.

Users should be able to modify or delete alerts.

---

# 27. NOTIFICATION SYSTEM

V1 should support:

## Website Notifications

Show notifications inside the user's account.

Examples:

```text
🔥 Elden Ring is now 50% OFF.

💰 Cyberpunk 2077 reached your target price.

🆓 Example Game is free for a limited time.

⏰ Your tracked giveaway ends tomorrow.
```

Maintain a notification database.

Notifications should have:

* ID
* User ID
* Type
* Title
* Message
* Related game
* Created timestamp
* Read/unread status

---

# 28. EMAIL NOTIFICATIONS

Send email notifications when user-configured conditions are triggered.

Examples:

```text
Subject:
🔥 Cyberpunk 2077 reached your target price

Current Price:
₹999

Discount:
67%

Store:
Steam

Your Target:
₹1,000

[View Deal]
```

Email notifications must be controlled by user preferences.

Do not send unnecessary marketing emails.

Use a proper transactional email provider rather than exposing personal SMTP credentials in frontend code.

---

# 29. NOTIFICATION ARCHITECTURE

Use an event-based approach.

Example:

```text
Background Price Checker
        ↓
Price changed
        ↓
Check user alerts
        ↓
Condition satisfied?
        ↓
      YES
        ↓
Create website notification
        ↓
Send email
```

Avoid sending duplicate notifications for the same event.

Implement notification deduplication.

---

# 30. BACKGROUND JOBS

WTP requires scheduled backend tasks.

Possible jobs:

### Deal Collector

Periodically retrieve deal information.

### Player Collector

Periodically retrieve player counts where supported.

### Giveaway Checker

Check limited-time free games.

### Alert Processor

Check user alert conditions.

### Notification Processor

Create/send notifications.

Do not run all expensive operations for every user page request.

Use background jobs and caching.

---

# 31. DATABASE

Preferred database:

**PostgreSQL**

Suggested tables:

```text
users
auth_accounts
games
genres
platforms
stores
game_stores
game_screenshots
game_trailers
game_requirements
game_prices
price_history
player_history
giveaways
wishlist
favourites
libraries
price_alerts
notifications
user_devices
user_preferences
```

Database design should be normalized where appropriate.

Use foreign keys and indexes.

---

# 32. GAME PRICE DATA MODEL

A price record should conceptually contain:

```text
id
game_id
store_id
country
currency
price
original_price
discount_percent
recorded_at
offer_ends_at
deal_url
```

Never overwrite historical records unnecessarily.

---

# 33. USER DATA SECURITY

Security is extremely important.

Never:

* Store plaintext passwords
* Expose API keys in frontend
* Put secrets in GitHub
* Put OAuth client secrets in React
* Trust client-provided authorization
* Allow users to access another user's data

Use:

* Password hashing
* JWT or secure session architecture
* Secure cookies where appropriate
* CSRF protection where applicable
* Input validation
* Rate limiting
* Authorization checks
* Environment variables
* Secure OAuth implementation
* OTP expiration
* OTP attempt limits

---

# 34. API KEY SECURITY

All private API keys must remain on the backend.

Example:

```text
GROQ_API_KEY
RAWG_API_KEY
YOUTUBE_API_KEY
OAUTH_CLIENT_SECRET
EMAIL_SERVICE_KEY
```

should NEVER be exposed to React/browser code.

Even though AI is intentionally NOT part of V1, this rule applies to every external API.

Frontend should communicate with our FastAPI backend.

---

# 35. ARCHITECTURE

Recommended architecture:

```text
                     USER
                       │
                       ↓
              React + TypeScript
                       │
                       ↓
                 FastAPI API
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      PostgreSQL   Background     Auth
                     Jobs
          │            │
          │      ┌─────┼─────┐
          │      ↓     ↓     ↓
          │    RAWG CheapShark Steam
          │
          └────────────┐
                       ↓
                 WTP Database
                       │
              ┌────────┴────────┐
              ↓                 ↓
          Website            Email
       Notifications      Notifications
```

---

# 36. FRONTEND

Recommended:

* React
* TypeScript
* Vite
* Tailwind CSS

Use a clean component architecture.

Potential structure:

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── assets/
```

Use reusable components.

Examples:

* GameCard
* DealCard
* ScreenshotGallery
* TrailerPlayer
* PriceHistoryChart
* StoreComparison
* RatingCard
* CompatibilityCard
* WishlistButton
* TrackButton
* NotificationBell
* SearchBar
* FilterPanel

---

# 37. BACKEND

Recommended:

**FastAPI + Python**

Responsibilities:

* Authentication
* OAuth
* User management
* Game APIs
* Deal aggregation
* Price history
* Wishlist
* Favourites
* Library
* Alerts
* Notifications
* PC compatibility
* API caching
* Background tasks
* Database operations

The frontend should not directly manage external API secrets.

---

# 38. API NORMALIZATION

Different external APIs return different formats.

Do not expose raw external API responses directly to the frontend.

Instead:

```text
RAWG
CheapShark
Steam
YouTube
   ↓
Backend
   ↓
Normalize
   ↓
WTP internal models
   ↓
PostgreSQL
   ↓
Frontend
```

This makes WTP independent of individual API structures.

---

# 39. CACHING

Do not repeatedly request the same external API data.

Use caching where appropriate.

For example:

```text
User opens Cyberpunk page
        ↓
Check WTP database/cache
        ↓
If fresh → return data
        ↓
If stale → background refresh
```

This reduces:

* API usage
* Server load
* Response time

---

# 40. RATE LIMITING

Protect both WTP and external APIs.

Implement rate limiting for:

* Login
* OTP requests
* OTP verification
* Password reset
* Search
* API endpoints
* Email sending
* Any expensive operation

Do not allow one user to consume unlimited resources.

---

# 41. ERROR HANDLING

External APIs can fail.

The website should not crash because one API is unavailable.

Example:

```text
RAWG unavailable
        ↓
Still show cached game information

Steam unavailable
        ↓
Show:
"Player data temporarily unavailable"

CheapShark unavailable
        ↓
Show cached deal information if available
```

Design graceful fallbacks.

---

# 42. LEGAL / DATA RULES

Only show legitimate ways to purchase or claim games.

Do not include:

* Pirated stores
* Torrents
* Cracked games
* Illegal download sources

Use legitimate store/deal links.

Respect the terms and licensing requirements of every API and data provider.

Do not scrape websites blindly when their terms prohibit it.

---

# 43. RESPONSIVENESS

The website must work well on:

* Desktop
* Laptop
* Tablet
* Mobile browser

However, V1 is a **PC gaming platform**, not a mobile application.

Do not build an Android app as part of V1.

---

# 44. NAVIGATION

Suggested main navigation:

```text
WHAT-TO-PLAY

Discover
Deals
Free Games
Most Popular
Most Anticipated
New Releases
Search

                        🔔
                        Profile
```

After login, profile/dashboard can expose:

```text
My Library
Wishlist
Favourites
Price Alerts
My PC
Notifications
Settings
```

---

# 45. GAME CARD

Game cards should show relevant information without becoming cluttered.

Example:

```text
[GAME ART]

Cyberpunk 2077

⭐ 8.7
RPG • Action

₹1,049
₹2,999
65% OFF

[View Game]
```

Optional:

* Free badge
* New badge
* Popular badge
* Anticipated badge

---

# 46. USER EXPERIENCE RULES

Important:

### Do

* Let users explore freely
* Keep pages fast
* Show useful information
* Make deals obvious
* Clearly display regional prices
* Make authentication easy
* Automatically continue an action after login
* Provide clear notifications

### Don't

* Force login immediately
* Spam notifications
* Hide important pricing information
* Pretend estimates are official numbers
* Claim compatibility guarantees
* Expose API keys
* Overuse animations
* Make the website look like an AI-generated template

---

# 47. HOSTING

The project is primarily being built for:

* Personal interest
* Learning
* GitHub
* LinkedIn
* Portfolio demonstration

Therefore, prioritize free or low-cost hosting during development.

Suggested setup:

```text
Frontend:
Vercel or similar

Backend:
Render or similar

Database:
Free PostgreSQL provider during development
```

Production-scale infrastructure is NOT required for V1.

The architecture should still be clean enough to scale later.

---

# 48. NO AI IN V1

Do NOT integrate:

* Groq
* ChatGPT
* Gemini
* AI recommendation systems
* AI chatbot

The user should decide which game they want.

WTP's job is to provide excellent information so users can make their own decisions.

The product should focus on:

> **Data + Discovery + Deals + History + Personalization**

rather than AI recommendations.

---

# 49. FUTURE FEATURES

Possible future additions:

* Steam account integration
* Steam library import
* Better store integrations
* Windows WTP PC Scanner
* Discord notifications
* Telegram notifications
* More regional stores
* More detailed game statistics
* Achievement tracking
* Playtime tracking
* Game completion tracking
* More metadata providers
* Android application

These are NOT required for V1.

---

# 50. DEVELOPMENT PRIORITY

Build the project in this order:

## Phase 1 — Foundation

* Project setup
* React frontend
* FastAPI backend
* PostgreSQL
* Environment configuration
* Basic API structure

## Phase 2 — Game Data

* RAWG integration
* Game database
* Game search
* Game details
* Screenshots
* Artwork

## Phase 3 — Deals

* CheapShark integration
* Store comparison
* Current prices
* Discounts
* Deal pages
* Price history

## Phase 4 — Steam

* Steam integration
* Current player counts
* Player history collection

## Phase 5 — Authentication

* WTP account
* Email OTP
* Google OAuth
* Microsoft OAuth
* Unified account system

## Phase 6 — Personalization

* Wishlist
* Favourites
* Library
* Price alerts
* User PC specifications

## Phase 7 — Notifications

* Website notifications
* Email notifications
* Alert processing
* Notification deduplication

## Phase 8 — Advanced Discovery

* Free Games
* Giveaway History
* Most Popular
* Most Anticipated
* New Releases
* Best Value
* PC-compatible games

## Phase 9 — Polish

* Responsive design
* Loading states
* Error states
* Caching
* Performance
* Security
* Accessibility
* SEO
* Deployment

---

# 51. IMPORTANT DEVELOPMENT RULE

Do not attempt to build the entire project as one giant implementation.

Build it feature-by-feature.

Before implementing a feature:

1. Define its data model.
2. Define backend endpoints.
3. Define frontend requirements.
4. Implement backend.
5. Test backend.
6. Implement frontend.
7. Test integration.
8. Handle errors.
9. Only then move to the next feature.

Avoid creating fake/mock functionality when a real backend implementation is required.

Use mock data only during initial UI development.

---

# 52. FINAL PRODUCT VISION

What-To-Play should ultimately feel like:

> **A personal command center for PC gaming.**

A user should be able to visit WTP and immediately answer:

* What games are popular?
* What games are coming?
* What games are free?
* What games are heavily discounted?
* Where can I legally buy this game?
* What is the current price in my country?
* What was the lowest price?
* How good is the game?
* How many people are playing?
* Can my PC run it?
* What does the game look like?
* Is there an official trailer?
* Should I track it?
* When does it become cheap/free?

And after signing in:

* What games do I want?
* What games do I own?
* What games am I tracking?
* What price am I waiting for?
* What notifications have I received?

The core principle is:

> **WTP doesn't choose the game for the user. WTP gives the user everything they need to choose it themselves.**
