import numpy as np
import io
import cv2
from scipy.stats import beta
import matplotlib.pyplot as plt

class ThompsonSampling:
    # define a function which returns an image as numpy array from figure
    def get_img_from_fig(fig, dpi=120):
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=dpi)
        buf.seek(0)
        img_arr = np.frombuffer(buf.getvalue(), dtype=np.uint8)
        buf.close()
        img = cv2.imdecode(img_arr, 1)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return img
    
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
