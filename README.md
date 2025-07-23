# Nieoficjalne spolszczenie LOGO! Soft Comfort

W tym repozytorium znajduje się spolszczenie do programu LOGO! Soft Comfort 8.4.

Zbudowane tłumaczenie znajduje się w [Releases]("https://github.com/bonk-dev/lsc-spolszczenie/releases").

- Nie jestem właścicielem aplikacji LOGO! Soft Comfort ani żadnej części jej własności intelektualnej.
- Ten plik jest przeznaczony wyłącznie do użytku edukacyjnego i osobistego.
- Wszelkie prawa do oryginalnej zawartości aplikacji należą do Siemens AG.

## Instalacja

Pliki należy wypakować do głównego katalogu aplikacji.
LSC najprawdopodobniej jest zainstalowane w `C:\Program Files\Siemens\LOGOComfort_V8.4`.

W takim wypadku plik `Language_pl_PL.properties` powinien zostać umieszczony w `C:\Program Files\Siemens\LOGOComfort_V8.4\Language_pl_PL.properties`.

Natomiast plik `Help_pl_PL.jar` w `C:\Program Files\Siemens\LOGOComfort_V8.4\Help_pl_PL.jar`.

## Budowanie

Do zbudowania potrzeba:
- HTML Help Workshop (a dokładniej kompilatora hhc.exe)
- 7-Zip (wbudowany w PowerShella Compress-Archive buduje niekompatybilne z LSC archiwa)

Aby zbudować tłumaczenie, uruchom `build.ps1`, albo `build.bat`.
