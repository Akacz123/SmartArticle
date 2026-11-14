# Smart Article

Inteligentny system rekomendacji artykułów analizujący zachowania użytkowników (kliknięcia, czas czytania, tematyka, oceny) i proponujący spersonalizowane treści.

## Funkcjonalności

- **Autentykacja i bezpieczeństwo:** Rejestracja i logowanie użytkowników, bezpieczne haszowanie haseł algorytmem BCrypt.
- **Profil użytkownika i szczegóły konta:** Klikalny awatar w nagłówku prowadzący do profilu z podsumowaniem aktywności, łącznym czasem czytania, średnią ocen oraz ulubionymi kategoriami.
- **Przeglądanie artykułów:** Lista artykułów z podziałem na kategorie (Sztuczna Inteligencja, Technologia, Cyberbezpieczeństwo, Zdrowie, Biznes, Nauka), szacowany czas czytania i wyszukiwarka na żywo.
- **Śledzenie aktywności:** Automatyczny pomiar czasu spędzonego na czytaniu każdego artykułu, oceny w skali 1–5 gwiazdek.
- **Moduł rekomendacji (ML - scikit-learn):**
  - Macierz użytkownik–artykuł (User-Item Matrix) uwzględniająca oceny, czas czytania oraz informację zwrotną.
  - Collaborative Filtering (filtracja oparta na współpracy).
  - Algorytm KNN (`NearestNeighbors` z metryką Cosine Similarity).
  - Faktoryzacja macierzy (`TruncatedSVD`).
  - Redukcja wymiarowości cech tekstowych za pomocą `PCA` i `TfidfVectorizer`.
- **Interfejs oceny trafności:** Możliwość oznaczenia rekomendacji jako trafnej lub nietrafnej, co wpływa na wagi w kolejnych cyklach rekomendacji.

## Technologie

- **Frontend:** React, CSS3
- **Backend:** C# / ASP.NET Core 10 / Entity Framework Core
- **Baza danych:** PostgreSQL (Npgsql)
- **ML / AI:** Python 3, scikit-learn, pandas, numpy

## Architektura API

- `POST /api/auth/register` – Rejestracja użytkownika
- `POST /api/auth/login` – Logowanie użytkownika
- `GET /api/users/{id}/profile` – Szczegóły konta i statystyki użytkownika
- `GET /api/articles` – Pobieranie listy artykułów (filtry: kategoria, wyszukiwarka)
- `GET /api/articles/{id}` – Szczegóły i pełna treść artykułu
- `GET /api/articles/categories` – Lista unikalnych kategorii
- `POST /api/activity` – Rejestracja aktywności (czas czytania, ocena, feedback)
- `GET /api/activity/user/{userId}` – Historia aktywności użytkownika
- `GET /api/recommendations/{userId}` – Spersonalizowane rekomendacje wygenerowane przez ML
- `POST /api/recommendations/feedback` – Zapis oceny trafności rekomendacji

## Uruchomienie projektu

### 1. Baza danych (PostgreSQL)
Upewnij się, że usługa PostgreSQL działa na porcie `5432` z bazą `smartarticle` (użytkownik `postgres`, hasło `postgres`). Migracje oraz początkowe artykuły tworzone są automatycznie przy starcie serwera backendu.

### 2. Backend (C#)
```bash
cd backend
dotnet run
```
Serwer uruchamia się pod adresem: `http://localhost:5000`

### 3. Frontend (React)
```bash
cd frontend
npm start
```
Aplikacja otwiera się pod adresem: `http://localhost:3000`
