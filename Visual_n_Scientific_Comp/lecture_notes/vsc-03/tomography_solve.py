import numpy as np
import matplotlib.pyplot as plt
import tomograph


def show_phantom(size):
    """
    Hilfsfunktion um sich das Originalbild anzuschauen.
    """
    Im = tomograph.phantom(size)
    plt.imshow(Im, cmap='gist_yarg', extent=[-1.0, 1.0, -1.0, 1.0], interpolation='nearest')
    plt.show()


show_phantom(128)


def create_sinogram(nAngles, nSamples, angle_range=(0, np.pi)):
    """
    Funktion soll Sinogram erzeugen

    :param angle_range: Winkel über die die Strahlen laufen in rad. default=(0-180 Grad)
    :param nAngles: Anzahl der Winkelschritte innerhalb der angle_range (Anzahl der Strahlenfronten)
    :param nSamples: Anzahl der Strahlen pro Winkel (Anzahl der Strahlen pro Strahlenfront)

    :return: Tuple sinogram matrix, Strahlstartpunkte, Strahlrichtungen
    """

    # Anlegen von leeren Matrizen für Strahlstart und -richtung
    # rp - Strahlstartpunkte: pro Winkelschritt, Anzahl der Strahlen pro Winkel viele x-y-Positionen
    # rd - Strahlrichtungen: pro Winkelschritt ein x-y-Richtung

    # Der mittlere Strahlenstartpunkt der Strahlenfront liegt auf dem Einheitskreis.
    # An jedem mittlere Strahlenstartpunkt der Strahenfront soll entlang der
    # Tangente nach links und rechts geganngen werden um die Strahlstartwerte
    # zu berechnen.

    # Tipp: Mittlere Strahlenstartpunkt in Polarkoordinatendarstellung
    # repräsentieren und dann in x/y Position umwandeln.

    # Tipp: Richtungsvektor der Strahlenfront ergibt sich auch direkt aus dem
    # mittlere Strahlenstartpunkt rd[i] -> np.array([-x, -y])

    # Tipp: Die Strahlstartpositionen der Strahlenfront ergeben sich über
    # rp[i, j] = np.array([x,y]) + s*np.array([-y,x])
    # wobei s Anzahl Strahlen viele Skalierungsfaktoren zwischen -1 und 1 mit
    # gleichmäßigen Abständen (np.linspace)

    # Ein sinogramm ist ein Array mit abgeschwaechten Intensitaeten pro Winkel
    # und Strahl, d.h. die Matrix ist ([Anzahl Strahlen] x [Anzahl der Winkel]),
    # bzw. Anzahl der Strahlen pro Aufnahme und die Anzahl der Aufnahmen.
    # sinogram = np.zeros((nAngles, nSamples))

    # for i in AnzahlWinkel:
    #   for j in AnzahlSamples:
    #       trace-Funktion aufrufen und sinogram-Matrix füllen
    #       sinogram[i,j] = ...

    # return sinogram, rp, rd


# ---------------------------------------------
# Main Programablauf:
# ---------------------------------------------
gridsizes = [32, 64]  # , 128, 256]
# plot mit unterfigures
fig, ax = plt.subplots(nrows=2, ncols=len(gridsizes))
# Für alle Gridsizes:
for i,ng in enumerate(gridsizes):
    print("GRID: ", ng)
    nGrid = ng
    # die Anzahl der Winkelstufen
    nSamples = 2 * nGrid
    nAngles = 2 * nGrid

    # Erstellen Sie das Sinogram mithilfe Ihrer zuvor geschriebenen Funktion.
    # Plotten Sie das Sinogram mit Hilfe von Matplotlib. Nutzen Sie die 'gist_yarg' color map
    # ax[0][i].imshow(Matrix, cmap="gist_yarg")

    # Die bekannten aufgenommenen Intensitaetswerte im Sinogram speichern wir als ein Vektor (siehe np.ravel)
    # in logarithmierter Form ab

    # Initialisieren Sie eine Matrix A in der gewünschten Größe.
    # Für jeden Winkel und jeden Strahl fügen wir jetzt eine Zeile in das Gelichungsystem ein.
    # Dafür müssen Sie über alle Winkel die Funktion grid_intersect (Rückgabe -> I, G, dt)
    # nutzen. I[k] beinhaltet den Index des Strahls, der mit der länge dt[k]
    # den Quadrant G[k] schneidet. Die errechneten Strahllängen pro Quadrant
    # (Pixel) sind dann die Einträge in die Matrix A. Gucken Sie notfalls nochmal
    # die Vorlesungsunterlagen an.

    # Achtung!: Die Strahlen indices I beziehen sich immer nur lokal auf die Strahlen,
    # die an grid_intersect übergeben wurden um den richtigen Index in der Matrix
    # zu finden muss (i*nSamples+I) berechnet werden, wobei i die Laufvariabel
    # über alle Winkel(nAngles) ist.
    # Hier kann etwas Indexmagic stattfinden: A[i*nSamples+I, G] = dt
    # Das ist das gleiche wie:
    # for k in range(len(I)):
    #   A[i*nSamples+I[k], G[k]] = dt[k]

    # --------------------------------------------------------------------------
    # Bis hier hin kommt ihr mit der ersten Vorlesung!
    # Wer neugierig ist, kann np.linalg.lstsq(A, b) benutzen.
    # Was dahinter steckt wird nächste Woche erklärt.
    # --------------------------------------------------------------------------

    # Lösen des Ausgleichsproblems mit Hilfe von np.linalg.solve

    # Lösungsvektor wieder auf die gewünschte Form bringen - reshape() und
    # wieder exponieren.

    # Plotten Sie die Rekonstruktion mit Hilfe von Matplotlib. Nutzen Sie die 'gist_yarg' color map
    # ax[1][i].imshow(Matrix, cmap="gist_yarg")


# plt.savefig('tg_fig.png', bbox_inches='tight')
plt.show()
