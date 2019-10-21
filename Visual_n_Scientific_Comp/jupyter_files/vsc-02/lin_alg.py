import numpy as np
import math


# (a) Berechnen Sie den Winkel $\alpha$ in Grad zwischen den folgenden beiden Vektoren $a=[1.,1.77]$ und $b=[1.5,1.5]$
a = np.array([-1.,1.77])
b = np.array([1.5,1.5])
# YOUR CODE HERE


# (b) Gegeben ist die quadratische regulaere Matrix A und ein Ergbnisvektor b. Rechnen Sie unter Nutzung der Inversen die Loesung x des Gleichungssystems Ax = b aus.
# YOUR CODE HERE

# (c) Schreiben Sie eine Funktion die das Matrixprodukt berechnet. Nutzen Sie dafür nicht die Numpy Implementierung.
# Hinweis: Fangen Sie bitte mögliche falsche Eingabegroessen in der Funktion ab und werfen einen AssertionError
# assert Expression[, Arguments]

def matmult(M1, M2):
    # YOUR CODE HERE
    pass

M1 = np.matrix('1 2; 3 4; 5 6')
M2 = np.matrix('2 0; 0 2')

print(M1, M2)

M_res = matmult(M1, M2)
print(M_res)