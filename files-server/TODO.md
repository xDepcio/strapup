[TODO] #1 DONE
endpoint GET `/api/templates/file?name=`
`name` - parametr oznaczający pełną scieżkę do pliku w obrębie schemaatu (np. `@userName/some-template/_strapupmetadata.json`)
Endpoint ten musi zwracać PLAIN TEXT wskazanego pliku. Musi też walidować, czy nie chcemy np. czytać plik do którego nie mamy dostępu. Do tego służy header `Authorization`, który musi się znaleźć wtedy w zapytaniu. Posiada on Github token użytkownika.

[TODO] #2 DONE
endpoint GET `/api/scripts?name=`
`name` - parametr oznaczający nazwę skryptu jaki schecemy zobaczyć.
Endpoint ten musi zwracać PLAIN TEXT wskazanego skryptu. Musi też walidować, czy nie chcemy np. czytać plik do którego nie mamy dostępu. Do tego służy header `Authorization`, który musi się znaleźć wtedy w zapytaniu. Posiada on Github token użytkownika.

[TODO] #3 DONE
endpoint POST `/api/templates`
W headerze `Authorization` musi być ważny token Github.
body requesta wygląda np. tak:
`json
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
    ` - Walidujemy użytkownika (sprawdzamy ważność tokenu, oraz czy @username jest takie same jak login pobrany z bazy danych). - Jeśli tak to zapisujemy do bazy danych rekord identyfikujący ten schemat. - Dalej zapisujemy w plikach servera ten schemat. - Zwracamy odpowiedź czy wszytko się powiodło lub też nie.

[TODO] #4 DONE
endpoint POST `/api/scripts`
W headerze `Authorization` musi być ważny token Github.
Body wygląda np. tak:
`json
    {
        "name": "@userName/my-script",
        "isPublic": true,
        "tags": ["Next", "Javascript", "Typescript"]
        "content": "Tu jest zawartość pliku .mjs ze skryptem."
    }
    ` - Walidujemy użytkownika (sprawdzamy ważność tokenu, oraz czy @username jest takie same jak login pobrany z bazy danych). - Jeśli tak to zapisujemy do bazy danych rekord identyfikujący ten skrypt. - Dalej zapisujemy w plikach servera ten skrypt. - Zwracamy odpowiedź czy wszytko się powiodło lub też nie.

[TODO] #5

Endpoint delete `/api/templates/[id]/

usuwa template z file-server i wpis z bazy danych

zwraca typowy json sucess message
