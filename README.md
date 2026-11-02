# Smart Article

Inteligentny system rekomendacji artykułów.

## Technologie

- **Frontend:** React
- **Backend:** C# / ASP.NET Core
- **Baza danych:** PostgreSQL
- **ML:** scikit-learn (Collaborative Filtering, KNN, PCA)

## Uruchomienie

### Backend

```bash
cd backend
dotnet run
```

### Frontend

```bash
cd frontend
npm start
```

### Baza danych

Wymagany PostgreSQL na `localhost:5432`. Domyślna baza: `smartarticle`, użytkownik: `postgres`, hasło: `postgres`.

Migracje aplikują się automatycznie przy starcie backendu.
