Notizen zu ex05 KNN Aufgabe 2

Verbesserungsvorschläge zu KNN:
1) Bei der Differenzbildung zur Bestimmung der kleinsten Distanz, 
wurden auch nicht relevante Bildbereiche mit einbezogen, z.B. weißer
oder schwarzer Hintergrund. Der Vergleich sollte sich auf Bereiche
erstrecken, die relevant für die Zuordnung sind, d.h. beim Auto der 
Bildbereich mit dem Auto, beim Gesicht der Gesichtsbereich mit Haaren.

2) Die Bilddaten zeigen die Instanzen in unterschiedlicher Größe und 
Transformation, sei es Schwarz/Weiß oder Farbe, sei es groß oder klein.
Eine Normierung der relevanten Features (siehe 1) wäre sinnvol.

3) Gerade bei der Gesichtserkennung kommt häufig noch eine Normierung zum 
Tragen die alle Augenpartien auf eine Höhe schiebt.
