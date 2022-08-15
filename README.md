# bayesarew

## per il corretto funzionamento delle traduzioni
### inserire in ogni pagina:

<html lang="{{lang}}"> per definire il linguaggio in base all'url


<head>
  ...
  <!-- HREFLANG -->
  ...
</head>
Il commento <!-- HREFLANG --> nell'head per inerire tutti i riferimenti alle altre traduzioni


<link rel="canonical" href="http://www.bayesarew.com/progetti" />
il link alla pagina con la traduzione italiana (considerato il linguaggio principale)

<a href="{{lang-prefix}}/progetti"></a>
all'inizio di ogni link aggiungere {{lang-prefix}} in modo tale da puntare alla corretta traduzione della pagina