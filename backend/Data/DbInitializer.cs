using SmartArticle.Api.Models;

namespace SmartArticle.Api.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (context.Articles.Any())
        {
            return;
        }

        var articles = new List<Article>
        {
            new()
            {
                Title = "Rewolucja w modelach językowych: Przyszłość generatywnego AI",
                Summary = "Analiza najnowszych trendów w rozwoju dużych modeli językowych oraz ich wpływu na codzienną pracę inżynierów.",
                Content = "W ostatnich latach obserwujemy bezprecedensowy rozwój sztucznej inteligencji. Modele oparte na architekturze Transformer rewolucjonizują kolejne gałęzie gospodarki. Od automatyzacji procesów biznesowych po tworzenie oprogramowania – integracja LLM staje się standardem. Wyzwaniem pozostaje optymalizacja zużycia zasobów obliczeniowych oraz kwestia dokładności i halucynacji.",
                Category = "Sztuczna Inteligencja",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-10)
            },
            new()
            {
                Title = "Architektura mikroserwisów w chmurze: Wzorce i antywzorce",
                Summary = "Praktyczny przewodnik po projektowaniu skalowalnych i odpornych na awarie systemów rozproszonych.",
                Content = "Przejście z monolitu na architekturę mikrousług wiąże się ze znacznym skomplikowaniem infrastruktury. Kluczowe jest zrozumienie wzorców takich jak Saga, Circuit Breaker czy Event Sourcing. Należy pamiętać o granicach kontekstów biznesowych (Bounded Contexts) i unikać tzw. rozproszonego monolitu.",
                Category = "Technologia",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-9)
            },
            new()
            {
                Title = "Komputery kwantowe a współczesna kryptografia",
                Summary = "Czy algorytm Shora zagrozi powszechnie stosowanemu szyfrowaniu RSA i co oferuje kryptografia postkwantowa?",
                Content = "Rozwój obliczeń kwantowych stawia pod znakiem zapytania bezpieczeństwo tradycyjnych asymetrycznych algorytmów kryptograficznych. Organizacje normalizacyjne, takie jak NIST, intensywnie pracują nad wdrożeniem standardów kryptografii postkwantowej opartej na sieciach kratowych.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-8)
            },
            new()
            {
                Title = "Rola uczenia maszynowego w diagnostyce medycznej",
                Summary = "Jak konwolucyjne sieci neuronowe pomagają radiologom we wczesnym wykrywaniu zmian patologicznych.",
                Content = "Zastosowanie metod Computer Vision w analizie rezonansu magnetycznego czy tomografii komputerowej osiąga skuteczność porównywalną z doświadczonymi lekarzami. Systemy te działają jako systemy wspomagania decyzji klinicznych, minimalizując błędy diagnostyczne.",
                Category = "Zdrowie",
                ReadTimeMinutes = 4,
                ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-7)
            },
            new()
            {
                Title = "Ekonomia platform cyfrowych i efekty sieciowe",
                Summary = "Mechanizmy wzrostu technologicznych gigantów w dobie cyfrowej transformacji rynków.",
                Content = "Firmy budujące rynki dwustronne i platformy cyfrowe korzystają z silnych bezpośrednich i pośrednich efektów sieciowych. Artykuł analizuje strategie monetaryzacji, koszty przejścia dla klientów oraz regulacje antymonopolowe.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-6)
            },
            new()
            {
                Title = "Algorytmy rekomendacyjne: Od Collaborative Filtering do Deep Learningu",
                Summary = "Przegląd metod filtracji opartej na współpracy, rozkładu macierzy i wektorowych reprezentacji użytkowników.",
                Content = "Systemy rekomendacyjne stanowią fundament sukcesu serwisów streamingowych i platform e-commerce. Klasyczne podejście oparte na macierzy interakcji (User-Item Matrix) i faktoryzacji macierzy SVD/NMF jest obecnie wzbogacane o głębokie sieci neuronowe i grafowe reprezentacje wiedzy.",
                Category = "Sztuczna Inteligencja",
                ReadTimeMinutes = 8,
                ImageUrl = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Title = "Zero Trust Architecture: Nowe podejście do bezpieczeństwa sieci",
                Summary = "Zasada 'nigdy nie ufaj, zawsze weryfikuj' jako odpowiedź na erę pracy zdalnej i chmury hybrydowej.",
                Content = "Tradycyjny model bezpieczeństwa obwodowego nie sprawdza się w dynamicznym środowisku korporacyjnym. Zero Trust zakłada ciągłą weryfikację tożsamości, kontekstu urządzenia oraz minimalizację uprawnień poprzez mikrosegmentację sieci.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Title = "Kosmologia obserwacyjna i odkrycia teleskopu Jamesa Webba",
                Summary = "Nowe spojrzenie na formowanie się pierwszych galaktyk i atmosfery planet pozasłonecznych.",
                Content = "Obserwacje w podczerwieni prowadzone przez teleskop kosmiczny JWST rzucają nowe światło na wczesne stadia ewolucji Wszechświata. Wykrycie dojrzałych galaktyk zaledwie kilkaset milionów lat po Wielkim Wybuchu zmusza astrofizyków do rewizji modeli teoretycznych.",
                Category = "Nauka",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                Title = "Green Computing: Efektywność energetyczna nowoczesnych centrów danych",
                Summary = "Strategie optymalizacji zużycia energii elektrycznej i chłodzenia w wielkoskalowych serwerowniach.",
                Content = "Rosnące zapotrzebowanie na moc obliczeniową dla AI wymaga zrównoważonego podejścia do infrastruktury. Inżynierowie wdrażają chłodzenie cieczowe zanurzeniowe, zaawansowane układy zasilania oraz dynamiczne harmonogramowanie obciążeń w zależności od dostępności energii odnawialnej.",
                Category = "Technologia",
                ReadTimeMinutes = 4,
                ImageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Title = "Telemedycyna i urządzenia ubieralne w profilaktyce kardiologicznej",
                Summary = "Ciągły monitoring rytmu serca z wykorzystaniem smartwatchy i algorytmów detekcji migotania przedsionków.",
                Content = "Nowoczesne sensory fotopletyzmograficzne i mobilne EKG zintegrowane w zegarkach pozwalają na wczesne wykrywanie niemych klinicznie arytmii. Dane przesyłane do chmury są analizowane w czasie rzeczywistym, co pozwala na szybką reakcję służb medycznych.",
                Category = "Zdrowie",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1510519138161-58446c623304?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Title = "Fintech i automatyzacja procesów finansowych z użyciem API",
                Summary = "Otwarte bankowanie (Open Banking) i wbudowane finanse (Embedded Finance) zmieniają rynek płatności.",
                Content = "Dyrektywy takie jak PSD2 otworzyły rynek finansowy dla innowacyjnych podmiotów trzecich. Automatyzacja rozliczeń, scoring kredytowy w czasie rzeczywistym oraz integracja mikropłatności redefiniują doświadczenia konsumenckie.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                Title = "Fizyka cząstek elementarnych: Co kryje się za Modelem Standardowym?",
                Summary = "Badania nad ciemną materią i poszukiwania nowej fizyki w Wielkim Zderzaczu Hadronów.",
                Content = "Mimo potwierdzenia istnienia bozonu Higgsa, Model Standardowy pozostawia wiele pytań bez odpowiedzi – takich jak natura ciemnej energii czy asymetria barionowa. Naukowcy w CERN przygotowują modernizację akceleratora High-Luminosity LHC.",
                Category = "Nauka",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        context.Articles.AddRange(articles);
        context.SaveChanges();
    }
}
