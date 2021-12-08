Feature: Bestelling Bestaande Klant

  Als verkoper kan ik een bestelling van schermen met al hun relevante
  afmetingen (lengte, breedte, dikte) en specifieke eisen van de klant (type
  materiaal...) noteren, zodat de productie deze informatie op elk moment kan
  raadplegen.

Scenario: Een bestelling toevoegen voor bestaande klant
  Given Ik bevind mij op de login pagina
  When Ik "kristof" in het username veld op geef
  And Ik "1234" in het password veld op geef
  And Ik druk op de knop Login
  Then Zou ik op de home pagina terecht komen
  When  Ik druk op de knop bestelling bestaande klant
  Then Zou ik op de pagina terecht komen waar ik een bestelling kan opnemen voor een bestaande klant

  When Ik "3" in het bestellingData.klantnummer veld in geef
  And Ik "Ingewikkeld in folie op palet" in het bestellingData.verpakkingsInformatie veld in geef
  And Ik "120cm" in het schermData.lengte veld in geef
  And Ik "110cm" in het schermData.breedte veld in geef
  And Ik "1.5cm" in het schermData.dikte veld in geef
  And Ik "Acrylaat" in het schermData.materiaalType veld in geef
  And Ik "3" in het schermData.aantal veld in geef
  And Ik "Kindvriendelijk geen scherpe randen" in het schermData.voorkeuren veld in geef
  And Ik druk op de knop scherm toevoegen
  Then Zou ik het toegevoegde scherm zien in de tabel
    |label          | data                               |
    |#              | 1                                  |
    |Lengte         | 120cm                              |
    |Breedte        | 110cm                              |
    |Dikte          | 1.5cm                              |
    |Materiaal Type | Acrylaat                           |
    |Aantal         | 3                                  |
    |Voorkeuren     | Kindvriendelijk geen scherpe randen|
  When  Ik druk op de knop bestelling bevestigen
  Then Zou ik op de succes pagina terecht komen
  And Ik sluit de browser



