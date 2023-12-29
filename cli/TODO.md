[TODO] #1 DONE
    Zmiana struktury składowania skrytów. Aktualnie jest to plik `scripts.mjs` w folderze `$HOME/.strapup/`.
    Musimy zrobić tak aby zamiast tego był folder `scripts/` a w nim pliki zawierające skrypty. `scripts.mjs` będzie zarezerwowaną nazwą, gdzię będą się znajdowały skrypty "biblioteczne". Zmiana ta jest potrzebna, bo skrypty są kodem ładowanym podczas wykonywania programu, w związku z tym błąd np. składniowy z jednym z nich wywalił by nam całą aplikację gdyby wszystkie znajdowały by się w jednym pliku. Taka zmiana też ułatwi nam życie gdy będziemy pobierać skrypty innych użytkowników.
    Czyli trzeba zmienić aktualną logikę ładowania skryptów o to, aby załadowała wszystkie z folderu `$HOME/.strapup/scripts/`.

[TODO] #2
    Jeśli któryś skrypt wkleja schemat którego nie mam zapisanego lokalnie, to trzeba to obsłużyć.
    Np. jest taka komenda w skrypcie: `npx strapup paste @userName/some-template`
    Patrzymy, że nie mamy takiego schematu, więc musimy go pobrać (patrz #3). Jak to zrobimy to można lecieć dalej.

[TODO] #5
    Jeśli któryś skrypt wykonuje inny skrypt, którego nie mamy zapisanego lokanie, to trzeba to obsłużyć.
    Np. jest taka komenda w skrypce: `npx strapup run-script @userName/some-script`.
    Patrzymy, że nie mamy takiego skryptu, więc go pobieramy (patrz #4). UWAGA Trzeba pamiętać, że nowo pobrany skrypt może wklejać schematy i wykonywać skrypty, których nie mamy pobranych, musi to więc działać też dla takiej syutacji (patrz #2).

[TODO] #3
    Można sobie wkleić template którego się nie ma lokalnie.
    Pod spodem działa to tak:
    - Najpierw leci zapytanie GET do backendu w GO `/api/templates/structure?name=@userName/some-template`. Zwraca strukturę plików schematu. Taka, odpowiedź jak się powiedzie, będzie wyglądać np. tak:
    ```json
    {
        "Name": "@xDepcio/template2",
        "IsDir": true,
        "Children": [
            {
                "Name": "_strapupmetadata.json",
                "IsDir": false,
                "Children": null
            },
            {
                "Name": "hooks.ts",
                "IsDir": false,
                "Children": null
            },
            {
                "Name": "services",
                "IsDir": true,
                "Children": [
                    {
                        "Name": "userApi.ts",
                        "IsDir": false,
                        "Children": null
                    }
                ]
            }
        ]
    }
    ```
    Jeśli chcemy użyć swój schemat, którego nie mamy lokalnie, a jest on ustawiony jako prywatny to w headerze zapytania trzeba dodać `Authorization` i jako wartość podać token z GitHuba. Ten token jest zapisywany w pliku z ustawieniami, gdy użytkownik zaloguje sie przez githuba.
    - Potem lecą zapytania GET do backendu w GO w stylu: `api/templates/file?name=@xDepcio/template2/_strapupmetadata.json`
    Czyli pytamy o każdy plik z tego schematu, odpowiedzią na te zapytanie będzie PLAIN TEXT (NIE JSON Z CZYMŚ TAM), z contentem danego pliku. W tym przypadku też może być potrzebna autoryzacja.
    - Na bierząco musimy budować strukturę schematu u użytkownika na urządzeniu. Potem będzie mógł go widzieć w schematach na urządzeniu.

    Użytkownik nie widzi tych wszystkich kroków (no chyba że jakiś błąd typu autoryzacja), więc ma to dalej działać tak jak wklejanie zwykłego schematu. Komentarz: Inne podejście pewnie miałoby lepszą wydajność, ale nie byłoby koncepcyjnie tak proste.
    UWAGA - problemem będzie zapisanie folderu którego nazwa zawiera "/" np. `@username/template` - wtedy zamieniamy "/" na taki escape string "_-_". Z poziomu użytkownika zmiana ta nie może być widoczna.

[TODO] #4 DONE
    Można sobie uruchomić skrypt którego nie mamy lokalnie.
    Pod spodem działa to tak:
    - Leci zapytanie GET do backendu w GO: `/api/scripts?name=@userName/some-script`
    `name` jest nazwą skryptu jaki chcemy wykonać. Jeśli skrypt jest nasz, ale ustawiony na prywatny, to w zapytaniu trzeba dodać header `Authorization` z wartością tokena GitHub. Ten token jest zapisywany w pliku z ustawieniami, gdy użytkownik zaloguje sie przez githuba. Zapytanie te zwróci PLAIN TEXT (NIE JSON Z CZYMŚ TAM), z contentem danego skryptu. Otrzymane text musimy zapisać jako nowy plik w folderze roboczym CLI w ścieżce `$HOME/.strapup/scripts/`. Nazwa tego pliku musi być taka sama jak nazwa skryptu. UWAGA nie można zapisać pliku z "/" w nazwie, więc zamieniamy `/` na `_-_`. Z poziomu użytkownika to nie może być widoczne. Następnie normalnie wykonujemy ten skrypt.

[TODO] #6 DONE
    Schemat który utworzyliśmy lokalnie, można zapisać sobie na naszym "cloudzie".
    Wygląda to tak, jeśli jesteśmy zalogowaniu przez GitHuba (valid token w pliku z ustawieniami), to mamy dostęp do opcji "post template".
    Po wejściu w nią, wybieramy schemat, który chcemy wrzucić na server. Następnie podajemy jak chcemy go nazwać (bo np. inaczej niż zapisaliśmy lokalnie), nazwa MUSI zaczynać się w taki sposób `@userName/`. Potem wybieramy, czy ma on być publiczny czy prywatny. Dalej wpisujemy tagi jakie chcemy do niego dodać. Np. dla schematu `@userName/Create-Flask-Postgres` damy `python flask postgres` - jest to ważne, bo będą one używane do wyszukiwania schematów.
    Klikamy enter i idzie zapytanie POST na server w GO: `api/templates`. W headerze `Authorization` zawsze musi znaleźć się ważny token Github, albo ta operacja sie nie uda.
    Jako body zapytania podajemy json o takiej strukturze:
    ```json
    {
        isPublic: false,
        tags: ["Next", "JavaScript", "TypeScript"],
        files: {
            "name": "@username/template-name",
            "isDir": true,
            "content": null,
            "children": [
                {
                    "name": "some-file.ts",
                    "isDir": false
                    "content": "Tu dajemy zawartość konkretnego pliku."
                    "children": null,
                },
                {
                    "name": "nested-dir",
                    "isDir": true
                    "content": null
                    "children": [...],
                }
            ]
        }
    }
    ```
    Sprawdzamy, czy jest error w odpowiedzi czy nie i coś tam z nim robimy. Całe dodawanie schematu do bazy danych itd... załatwia server w GO dzięki naszemu zapytaniu.
    Czemu te podejście tutaj a w #3 odwotne? - Tutaj jest to prostsze koncepcyjnie gdy zrobimy w taki sposób, i nie chcemy też aby wsytąpiłą sytuacja, że zapiszemy tylko część schematu, a nie całość.

[TODO] #7 DONE
    Popatrz na #6. Tutaj robimy to samo (prawie, szczegóły niżej), tylko że dla skryptu.
    UWAGA skrypty są zapisywane jako pliki z kodem JS, czyli aby miało to ręcę i nogi to każdy taki skrypt musi znajdywać się w odzielnym pliku i w jednym pliku może być MAX 1 skrypt (patrz #1).
    Czyli do zapisania na "chmurze" użytkownik będzie miał do wyboru tylko te skrypty, które przejdą powyższą walidację.
    Okej czyli pod spodem działa to tak [...#6]
    Idzie zapytanie POST na server w GO: `/api/scripts`, z headerem `Authorization` i wartością tokena Github, z body:
    ```json
    {
        "name": "@userName/my-script",
        "isPublic": true,
        "tags": ["Next", "Javascript", "Typescript"]
        "content": "Tu jest zawartość pliku .mjs ze skryptem."
    }
    ```

[TODO] #8
    Naprawienie tryby headless - aktualnie kopia kodu z poprawkami w katalogu `/headless` - rozwiązanie na tyle biedne że należy to zmienić. Przy odpalaniu programu z jakimkolwiek argumentem, flaga `HEADLESS` musi zostać ustawiona na `true`, a wykonanie programu uzależnione od wartości tej flagi.
