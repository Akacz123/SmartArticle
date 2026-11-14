using SmartArticle.Api.Models;

namespace SmartArticle.Api.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (context.Articles.Count() >= 30)
        {
            return;
        }

        var existingTitles = context.Articles.Select(a => a.Title).ToHashSet();

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
                PublishedAt = DateTime.UtcNow.AddDays(-20)
            },
            new()
            {
                Title = "Architektura mikroserwisów w chmurze: Wzorce i antywzorce",
                Summary = "Praktyczny przewodnik po projektowaniu skalowalnych i odpornych na awarie systemów rozproszonych.",
                Content = "Przejście z monolitu na architekturę mikrousług wiąże się ze znacznym skomplikowaniem infrastruktury. Kluczowe jest zrozumienie wzorców takich jak Saga, Circuit Breaker czy Event Sourcing. Należy pamiętać o granicach kontekstów biznesowych i unikać rozproszonego monolitu.",
                Category = "Technologia",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-19)
            },
            new()
            {
                Title = "Komputery kwantowe a współczesna kryptografia",
                Summary = "Czy algorytm Shora zagrozi powszechnie stosowanemu szyfrowaniu RSA i co oferuje kryptografia postkwantowa?",
                Content = "Rozwój obliczeń kwantowych stawia pod znakiem zapytania bezpieczeństwo tradycyjnych asymetrycznych algorytmów kryptograficznych. Organizacje normalizacyjne, takie jak NIST, intensywnie pracują nad wdrożeniem standardów kryptografii postkwantowej opartej na sieciach kratowych.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-18)
            },
            new()
            {
                Title = "Rola uczenia maszynowego w diagnostyce medycznej",
                Summary = "Jak konwolucyjne sieci neuronowe pomagają radiologom we wczesnym wykrywaniu zmian patologicznych.",
                Content = "Zastosowanie metod Computer Vision w analizie rezonansu magnetycznego czy tomografii komputerowej osiąga skuteczność porównywalną z doświadczonymi lekarzami. Systemy te działają jako systemy wspomagania decyzji klinicznych, minimalizując błędy diagnostyczne.",
                Category = "Zdrowie",
                ReadTimeMinutes = 4,
                ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-17)
            },
            new()
            {
                Title = "Ekonomia platform cyfrowych i efekty sieciowe",
                Summary = "Mechanizmy wzrostu technologicznych gigantów w dobie cyfrowej transformacji rynków.",
                Content = "Firmy budujące rynki dwustronne i platformy cyfrowe korzystają z silnych bezpośrednich i pośrednich efektów sieciowych. Artykuł analizuje strategie monetaryzacji, koszty przejścia dla klientów oraz regulacje antymonopolowe.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-16)
            },
            new()
            {
                Title = "Algorytmy rekomendacyjne: Od Collaborative Filtering do Deep Learningu",
                Summary = "Przegląd metod filtracji opartej na współpracy, rozkładu macierzy i wektorowych reprezentacji użytkowników.",
                Content = "Systemy rekomendacyjne stanowią fundament sukcesu serwisów streamingowych i platform e-commerce. Klasyczne podejście oparte na macierzy interakcji (User-Item Matrix) i faktoryzacji macierzy SVD/NMF jest obecnie wzbogacane o głębokie sieci neuronowe i grafowe reprezentacje wiedzy.",
                Category = "Sztuczna Inteligencja",
                ReadTimeMinutes = 8,
                ImageUrl = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-15)
            },
            new()
            {
                Title = "Zero Trust Architecture: Nowe podejście do bezpieczeństwa sieci",
                Summary = "Zasada 'nigdy nie ufaj, zawsze weryfikuj' jako odpowiedź na erę pracy zdalnej i chmury hybrydowej.",
                Content = "Tradycyjny model bezpieczeństwa obwodowego nie sprawdza się w dynamicznym środowisku korporacyjnym. Zero Trust zakłada ciągłą weryfikację tożsamości, kontekstu urządzenia oraz minimalizację uprawnień poprzez mikrosegmentację sieci.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-14)
            },
            new()
            {
                Title = "Kosmologia obserwacyjna i odkrycia teleskopu Jamesa Webba",
                Summary = "Nowe spojrzenie na formowanie się pierwszych galaktyk i atmosfery planet pozasłonecznych.",
                Content = "Obserwacje w podczerwieni prowadzone przez teleskop kosmiczny JWST rzucają nowe światło na wczesne stadia ewolucji Wszechświata. Wykrycie dojrzałych galaktyk zaledwie kilkaset milionów lat po Wielkim Wybuchu zmusza astrofizyków do rewizji modeli teoretycznych.",
                Category = "Nauka",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-13)
            },
            new()
            {
                Title = "Green Computing: Efektywność energetyczna nowoczesnych centrów danych",
                Summary = "Strategie optymalizacji zużycia energii elektrycznej i chłodzenia w wielkoskalowych serwerowniach.",
                Content = "Rosnące zapotrzebowanie na moc obliczeniową dla AI wymaga zrównoważonego podejścia do infrastruktury. Inżynierowie wdrażają chłodzenie cieczowe zanurzeniowe, zaawansowane układy zasilania oraz dynamiczne harmonogramowanie obciążeń.",
                Category = "Technologia",
                ReadTimeMinutes = 4,
                ImageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-12)
            },
            new()
            {
                Title = "Telemedycyna i urządzenia ubieralne w profilaktyce kardiologicznej",
                Summary = "Ciągły monitoring rytmu serca z wykorzystaniem smartwatchy i algorytmów detekcji migotania przedsionków.",
                Content = "Nowoczesne sensory fotopletyzmograficzne i mobilne EKG zintegrowane w zegarkach pozwalają na wczesne wykrywanie niemych klinicznie arytmii. Dane przesyłane do chmury są analizowane w czasie rzeczywistym.",
                Category = "Zdrowie",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1510519138161-58446c623304?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-11)
            },
            new()
            {
                Title = "Fintech i automatyzacja procesów finansowych z użyciem API",
                Summary = "Otwarte bankowanie (Open Banking) i wbudowane finanse (Embedded Finance) zmieniają rynek płatności.",
                Content = "Dyrektywy takie jak PSD2 otworzyły rynek finansowy dla innowacyjnych podmiotów trzecich. Automatyzacja rozliczeń, scoring kredytowy w czasie rzeczywistym oraz integracja mikropłatności redefiniują doświadczenia konsumenckie.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-10)
            },
            new()
            {
                Title = "Fizyka cząstek elementarnych: Co kryje się za Modelem Standardowym?",
                Summary = "Badania nad ciemną materią i poszukiwania nowej fizyki w Wielkim Zderzaczu Hadronów.",
                Content = "Mimo potwierdzenia istnienia bozonu Higgsa, Model Standardowy pozostawia wiele pytań bez odpowiedzi – takich jak natura ciemnej energii czy asymetria barionowa. Naukowcy w CERN przygotowują modernizację akceleratora High-Luminosity LHC.",
                Category = "Nauka",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-9)
            },
            new()
            {
                Title = "Kubernetes w produkcji: Praktyczny przewodnik po skalowaniu",
                Summary = "Zarządzanie klastrami kontenerów, autoscaling HPA oraz monitorowanie z wykorzystaniem Prometheus i Grafana.",
                Content = "Kubernetes stał się standardem orkiestracji kontenerów w środowiskach produkcyjnych. Artykuł omawia konfigurację Horizontal Pod Autoscaler, zarządzanie ingressami, polityki sieciowe oraz automatyczne odzyskiwanie sprawności podów w chmurze publicznej.",
                Category = "Chmura i DevOps",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-8)
            },
            new()
            {
                Title = "Nowoczesny TypeScript: Zaawansowane typy generyczne i utility types",
                Summary = "Jak pisać bezpieczny typograficznie kod w dynamicznych aplikacjach webowych.",
                Content = "TypeScript dostarcza zaawansowany system typów wspierający conditional types, mapped types oraz template literal types. Prawidłowe modelowanie struktur danych w kodzie pozwala eliminować błędy na etapie kompilacji i przyspiesza refaktoryzację.",
                Category = "Programowanie",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-8)
            },
            new()
            {
                Title = "Optymalizacja zapytań w PostgreSQL: Indeksy B-Tree, BRIN i GIN",
                Summary = "Analiza planów wykonania zapytań EXPLAIN ANALYZE i dobór indeksów w relacyjnych bazach danych.",
                Content = "Bazy danych wymagają starannego projektowania indeksów. W artykule przedstawiono różnice między tradycyjnymi indeksami B-Tree, indeksami BRIN dedykowanymi dla dużych szeregów czasowych oraz indeksami GIN stosowanymi przy przeszukiwaniu pełnotekstowym i typach JSONB.",
                Category = "Technologia",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-7)
            },
            new()
            {
                Title = "Bezpieczeństwo łańcucha dostaw oprogramowania (Software Supply Chain Security)",
                Summary = "Ataki na repozytoria zależności npm i PyPI oraz metody obrony z wykorzystaniem SBOM i weryfikacji podpisów.",
                Content = "Wzrost liczby ataków na biblioteki open-source wymusza stosowanie Software Bill of Materials (SBOM). Automatyczna analiza podatności w potokach CI/CD, podpisywanie artefaktów za pomocą Cosign oraz izolacja środowisk budowania to niezbędne elementy ochrony nowoczesnych systemów.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-7)
            },
            new()
            {
                Title = "Uczenie ze wzmocnieniem (Reinforcement Learning) w autonomicznych pojazdach",
                Summary = "Zastosowanie algorytmów PPO i DQN w symulacji jazdy i podejmowaniu decyzji w warunkach miejskich.",
                Content = "Autonomiczne pojazdy korzystają z modeli uczenia maszynowego do fuzji danych z czujników LiDAR, radarów i kamer. Uczenie ze wzmocnieniem w wirtualnych środowiskach symulacyjnych umożliwia bezpieczne trenowanie zachowań w trudnych warunkach drogowych.",
                Category = "Sztuczna Inteligencja",
                ReadTimeMinutes = 8,
                ImageUrl = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-6)
            },
            new()
            {
                Title = "Mikrofrontendy w praktyce: Modułowa federacja aplikacji React i Vue",
                Summary = "Rozbijanie złożonych monolitów frontendowych na niezależnie wdrażane moduły przy użyciu Webpack Module Federation.",
                Content = "Wielkie zespoły inżynieryjne często zmagają się z trudnościami we wspólnym rozwoju jednego repozytorium frontendowego. Mikrofrontendy pozwalają różnym zespołom tworzyć autonomiczne fragmenty interfejsu użytkownika z zachowaniem spójnego design systemu.",
                Category = "Programowanie",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-6)
            },
            new()
            {
                Title = "Biologia syntetyczna i edycja genów CRISPR-Cas9",
                Summary = "Przełomowe terapie genowe, leczenie chorób rzadkich oraz bioetyczne wyzwania inżynierii genetycznej.",
                Content = "Metoda CRISPR-Cas9 umożliwiła precyzyjne cięcie i modyfikację sekwencji DNA w żywych komórkach. Od terapii nowotworowych po rośliny odporne na suszę – biologia syntetyczna otwiera nowe perspektywy dla medycyny i rolnictwa.",
                Category = "Nauka",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Title = "Zarządzanie produktem w startupie: Od MVP do Product-Market Fit",
                Summary = "Jak weryfikować hipotezy rynkowe, zbierać feedback od pierwszych użytkowników i unikać przedwczesnego skalowania.",
                Content = "Sukces nowego produktu technologicznego zależy od umiejętności szybkiego uczenia się na błędach. Tworzenie Minimal Viable Product, monitorowanie retencji oraz wskaźników Unit Economics pomaga założycielom osiągnąć stabilną pozycję na konkurencyjnym rynku.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Title = "Infrastruktura jako kod (IaC): Terraform vs Pulumi",
                Summary = "Porównanie deklaratywnego HCL z podejściem bazującym na pełnych językach programowania takich jak TypeScript i C#.",
                Content = "Automatyzacja zarządzania chmurą AWS, Azure i GCP wymaga powtarzalnych definicji środowisk. Artykuł zestawia popularne narzędzia Terraform i Pulumi, analizując zarządzanie stanem, łatwość testowania modułów oraz integrację w pipeline CI/CD.",
                Category = "Chmura i DevOps",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                Title = "Wpływ snu na neuroplastyczność mózgu i pamięć roboczą",
                Summary = "Badania z zakresu neuronauki nad fazą REM, konsolidacją śladów pamięciowych i redukcją toksyn w mózgu.",
                Content = "Podczas głębokiego snu układ gliimfatyczny oczyszcza tkankę nerwową ze szkodliwych metabolitów, w tym beta-amyloidu. Zrozumienie rytmów okołodobowych i higieny snu ma fundamentalne znaczenie dla wydajności poznawczej pracowników umysłowych.",
                Category = "Zdrowie",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                Title = "Projektowanie REST API zgodnie ze standardami OpenAPI 3.1",
                Summary = "Dobre praktyki wersjonowania, walidacji danych wejściowych, kody statusów HTTP oraz generowanie SDK.",
                Content = "Przejrzysta specyfikacja interfejsu programistycznego skraca czas integracji między zespołami frontendowymi i backendowymi. Podejście API-First pozwala na równoległą pracę deweloperów oraz automatyczne generowanie dokumentacji i mocków.",
                Category = "Programowanie",
                ReadTimeMinutes = 4,
                ImageUrl = "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Title = "Etyka w sztucznej inteligencji: Bias w zbiorach danych i Explainable AI (XAI)",
                Summary = "Jak zapobiegać dyskryminacji algorytmicznej i budować interpretowalne modele uczenia maszynowego.",
                Content = "Modele uczenia maszynowego trenowane na historycznych danych mogą utrwalać niepożądane uprzedzenia społeczne. Metody Explainable AI, takie jak SHAP czy LIME, pozwalają zrozumieć wagę poszczególnych cech w procesie decyzyjnym modelu.",
                Category = "Sztuczna Inteligencja",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Title = "Fuzja termojądrowa: Czy zbliżamy się do nieskończonej czystej energii?",
                Summary = "Postępy w tokamakach magnetycznych i zapłonie laserowym w National Ignition Facility.",
                Content = "Osiągnięcie dodatniego bilansu energetycznego Q > 1 w eksperymentach z fuzją deuteru i trytu przybliża ludzkość do komercyjnych elektrowni termojądrowych. Artykuł wyjaśnia wyzwania materiałowe i stabilność plazmy w reaktorach.",
                Category = "Nauka",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                Title = "Serverless w architekturze korporacyjnej: AWS Lambda i Azure Functions",
                Summary = "Kiedy model bezserwerowy przynosi realne oszczędności, a kiedy problemem staje się Cold Start i vendor lock-in.",
                Content = "Model Serverless eliminuje konieczność administrowania maszynami wirtualnymi i skaluje się od zera do tysięcy równoległych wywołań. Kluczowe jest odpowiednie zarządzanie połączeniami do baz danych i monitorowanie czasu odpowiedzi funkcji.",
                Category = "Chmura i DevOps",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                Title = "Architektura Hexagonalna (Ports and Adapters) w systemach domenowych",
                Summary = "Odseparowanie logiki biznesowej od szczegółów technologicznych w Domain-Driven Design.",
                Content = "Zastosowanie architektury heksagonalnej ułatwia testowanie jednostkowe i uniezależnia model dziedzinowy od frameworków webowych czy baz danych. Artykuł prezentuje implementację portów wejściowych i adapterów infrastrukturalnych w C# i Javie.",
                Category = "Programowanie",
                ReadTimeMinutes = 6,
                ImageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                Title = "Wpływ mikrobioty jelitowej na układ odpornościowy i nastrój",
                Summary = "Oś jelito-mózg, produkcja serotoniny przez florę bakteryjną i znaczenie diety bogatej w błonnik.",
                Content = "Coraz więcej badań wskazuje na ścisły związek między składem bakterii jelitowych a funkcjonowaniem układu nerwowego. Dieta przeciwzapalna i probiotykoterapia mogą wspierać leczenie zaburzeń nastroju i stanów lękowych.",
                Category = "Zdrowie",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                Title = "Budowanie odporności organizacji na incydenty ransomware",
                Summary = "Procedury Disaster Recovery, niezmienne kopie zapasowe (Immutable Backups) i testy scenariuszowe.",
                Content = "Współczesne ataki ransomware to zorganizowany przemysł wymuszeń. Skuteczna ochrona wymaga nie tylko zapobiegania infekcjom, ale przede wszystkim przygotowania planów ciągłości działania oraz bezpiecznych kopii zapasowych odizolowanych od głównej sieci.",
                Category = "Cyberbezpieczeństwo",
                ReadTimeMinutes = 7,
                ImageUrl = "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow
            },
            new()
            {
                Title = "Fundusze Venture Capital w Europie Środkowo-Wschodniej: Trendy inwestycyjne",
                Summary = "Wyceny spółek technologicznych, rundy Seed i Serii A oraz oczekiwania inwestorów wobec rentowności.",
                Content = "Rynek finansowania startupów przeszedł korektę, premiując zrównoważony wzrost zamiast ekspansji za wszelką cenę. Artykuł omawia kluczowe wskaźniki, na które zwracają uwagę fundusze VC w sektorach B2B SaaS i DeepTech.",
                Category = "Biznes",
                ReadTimeMinutes = 5,
                ImageUrl = "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80",
                PublishedAt = DateTime.UtcNow
            }
        };

        var toAdd = articles.Where(a => !existingTitles.Contains(a.Title)).ToList();
        if (toAdd.Any())
        {
            context.Articles.AddRange(toAdd);
            context.SaveChanges();
        }
    }
}
