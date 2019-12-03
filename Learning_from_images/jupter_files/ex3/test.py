from __future__ import print_function
import torch

# show plot first run
%matplotlib inline 
# test autocompletion with tab or tab+shift
%config IPCompleter.greedy=True 

x = torch.empty(5, 3)
print(x)
x = torch.rand(5,3)
print(x)
x = torch.zeros(5, 3, dtype=torch.long)
print(x)