from tensorflow.keras.models import load_model

model = load_model("./model/best_model.h5")

for i, layer in enumerate(model.layers):
    print(i, layer.name, layer.__class__.__name__)
