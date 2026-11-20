# Smart Article

Inteligentny system rekomendacji artykułów analizujący zachowania użytkowników (kliknięcia, czas czytania, tematyka, oceny) i proponujący spersonalizowane treści na podstawie metod inteligencji obliczeniowej i uczenia maszynowego (przedmiot: *Informatyka i Systemy Inteligentne*).

## Funkcjonalności

- **Autentykacja i zarządzanie kontem:** Rejestracja i logowanie użytkowników, haszowanie haseł BCrypt, edycja nicku oraz bezpieczna zmiana hasła.
- **Baza artykułów i paginacja:**
  - Obszerna baza kilkuset artykułów technicznych i naukowych w kategoriach: *Sztuczna Inteligencja, Cyberbezpieczeństwo, Chmura i DevOps, Programowanie, Biznes, Zdrowie, Nauka, Technologia*.
  - Paginacja strony (stronicowanie) z nawigacją poprzednia/następna oraz bezpośrednim wyborem stron.
  - Wyszukiwarka słów kluczowych i filtrowanie kategorii.
  - Automatyczna synchronizacja z zewnętrznym API (Dev.to) z poziomu interfejsu użytkownika.
- **Śledzenie aktywności czytelnika:** Pomiar rzeczywistego czasu czytania (w sekundach), ocenianie jakości w skali 1–5 gwiazdek.
- **Moduł rekomendacji (Collaborative Filtering & KNN):**
  - Macierz interakcji użytkownik–artykuł (User-Item Matrix) z wagami czasu i ocen.
  - Faktoryzacja macierzy (`TruncatedSVD`).
  - Algorytm k-najbliższych sąsiadów (`NearestNeighbors` z metryką Cosine Similarity).
  - Interfejs oceny trafności rekomendacji (Trafna/Nietrafna), modyfikujący wagi w modelu.
- **Moduł Predykcji i Analityki Inteligentnej (Systemy Inteligentne):**
  - **Segmentacja behawioralna (User Persona):** Klasyfikacja czytelnika do profilu z określeniem pewności modelu (Confidence).
  - **Predykcja kolejnej tematyki (Next-Step Category Prediction):** Model estymacji prawdopodobieństwa przejścia do kolejnej kategorii artykułów.
  - **Prognoza czasu i zaangażowania:** Wyznaczenie optymalnego czasu skupienia na lekturze oraz wskaźnika zaangażowania użytkownika.
  - **Wektorowa przestrzeń podobieństwa PCA 2D:** Rzutowanie wektorów cech tekstowych TF-IDF i profilu użytkownika na 2 główne składowe PCA z interaktywną mapą punktową.

## Technologie

- **Frontend:** React, CSS3 (nowoczesny interfejs bez zbędnych emotikonów, wektory SVG)
- **Backend:** C# / ASP.NET Core 10 / Entity Framework Core
- **Baza danych:** PostgreSQL (Npgsql)
- **ML / AI:** Python 3, scikit-learn, pandas, numpy

## Architektura API

- `POST /api/auth/register` – Rejestracja użytkownika
- `POST /api/auth/login` – Logowanie użytkownika
- `GET /api/users/{id}/profile` – Szczegóły profilu i statystyki użytkownika
- `PUT /api/users/{id}/profile` – Aktualizacja nazwy użytkownika
- `PUT /api/users/{id}/change-password` – Zmiana hasła użytkownika
- `GET /api/articles?page=1&pageSize=12` – Paginowana lista artykułów z filtrami
- `GET /api/articles/{id}` – Pełna treść wybranego artykułu
- `GET /api/articles/categories` – Lista unikalnych kategorii tematycznych
- `POST /api/articles/sync-external` – Synchronizacja artykułów z zewnętrznego API
- `POST /api/activity` – Rejestracja aktywności czytelnika (czas, ocena, feedback)
- `GET /api/activity/user/{userId}` – Historia aktywności użytkownika
- `GET /api/recommendations/{userId}` – Personalizowane rekomendacje wygenerowane przez model ML
- `POST /api/recommendations/feedback` – Zapis oceny trafności rekomendacji
- `GET /api/intelligence/analytics/{userId}` – Analityka predykcyjna, segmentacja i współrzędne rzutowania PCA 2D

## Uruchomienie projektu

### 1. Baza danych (PostgreSQL)
Upewnij się, że usługa PostgreSQL działa na porcie `5432` z bazą `smartarticle` (użytkownik `postgres`, hasło `postgres`). Migracje aplikują się automatycznie przy starcie backendu.

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
