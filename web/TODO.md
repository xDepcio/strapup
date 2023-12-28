[TODO]
    Element UI, dzięki któremu da się zalogować za pomocą GitHuba.

[TODO]
    Element UI dzięki któremu użytkownik DOPERIO PO ZALOGOWANIU może zobaczyć swój profil.
    Na profilu są przede wszystkim jego schematy/skrypty (dalej sh/sk), sh/sk które zbookmarkował.

[TODO] #Started but not finsihed. dodany seach component na navbarze.
    Element UI odpowiadający za wyszukiwanie sh/sk - dostępny dla zalogowanych i nie zalogowanych.
    Np. lupka na navbarze, gdzie po wpisaniu wartości na bierząco będą uzupełniane najbardziej pasujące wyniki. Z tego poziomu można przejść do konkretnego sh/sk, lub kliknąć enter i przejść do widoku z listą najbardziej pasujących wyników naszego wyszukania.
    Z tego poziomu powinno dać się edytować filtry, przewijać na kolejne strony, itd...
    Nazwy sh/sk mają konretną strukturę: `@userName/Create-NextJS-Redux`. Nasza lupka musi być na tyle mądra aby na podstawie takiego stringa wyszukać pasujący sh/sk. W tym celu sh/sk muszą być zapisane w bazie danych z odpowiednią ilością metadanych (tagi np. NextJS, React, Python).
    [TODO]
        Uzupełnić DB o tabelę `scripts`, która przechowuje metadane skryptów użytkownika. (id, userId, isPublic, tags, starCounts, ...). - wymaga dodania relacji w tabeli `users`.
        Dodać do tabeli `templates` odpowiednie metadane (id, userId, isPublic, tags, starCounts, ...). - wymaga dodania relacji w tabeli `users`.
