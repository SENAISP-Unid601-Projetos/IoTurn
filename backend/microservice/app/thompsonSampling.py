import numpy as np
from scipy.stats import beta

class ThompsonSampling:
    def choose_arm(self, arms_json: list):

        """Loopa o json recebido para montar a seguinte estrutura:
            samples = {
                'Braço A': 0.72,  # Valor amostrado da Beta
                'Braço B': 0.65,
                'Braço C': 0.81
            }
        """
        samples = {

            #A distribuição Beta gera números entre 0 e 1 (como uma probabilidade)
            #Quanto maior alpha em relação a beta, maior a probabilidade amostrada
            arm.id: np.random.beta(arm.successes + 1, arm.failures + 1)
            for arm in arms_json
        }

        #max() para encontrar qual braço teve a maior amostra:
        best_arm = max(samples, key=samples.get)
        return best_arm
