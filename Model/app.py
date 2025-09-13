from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
import numpy as np
import tensorflow as tf
import cv2
import base64
from io import BytesIO
from PIL import Image
import openai
from dotenv import load_dotenv
import os
# tf-keras-vis imports
from tf_keras_vis.gradcam import Gradcam

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
load_dotenv()
# ✅ Load trained custom model (for predictions)
MODEL_PATH = "./model/best_model.h5"
custom_model = load_model(MODEL_PATH)
CLASS_LABELS = ["Normal", "Cyst", "Stone", "Tumor"]

# ✅ Load ResNet50 (only for GradCAM)
resnet_model = ResNet50(weights="imagenet")

# ----------------- Helper Functions -----------------
def preprocess_image(file, target_size=(224, 224), use_resnet=False):
    img = Image.open(file).convert("RGB")
    img = img.resize(target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    if use_resnet:
        img_array = preprocess_input(img_array)  # ResNet preprocessing
    else:
        img_array = img_array / 255.0  # Custom model preprocessing

    return img_array, np.array(img)

def encode_image_to_base64(image_array):
    img_pil = Image.fromarray(image_array)
    buffered = BytesIO()
    img_pil.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# ----------------- Prediction API -----------------
@app.route('/predict', methods=['POST'])
def predict_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    img_array, _ = preprocess_image(file, use_resnet=False)

    prediction = custom_model.predict(img_array)
    predicted_class_idx = int(np.argmax(prediction, axis=1)[0])
    predicted_class_name = CLASS_LABELS[predicted_class_idx]

    response = {
        "prediction": prediction.tolist(),
        "predicted_class": predicted_class_idx,
        "classification": predicted_class_name
    }
    return jsonify(response)

# ----------------- Grad-CAM API -----------------
@app.route('/gradcam', methods=['POST'])
def gradcam_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    img_array, original_img = preprocess_image(file, use_resnet=True)
    original_img = original_img.astype(np.uint8)

    prediction = resnet_model.predict(img_array)
    decoded = decode_predictions(prediction, top=1)[0][0]
    predicted_class_idx = np.argmax(prediction[0])

    # ✅ Define score function for GradCAM
    def score(output):
        return output[:, predicted_class_idx]

    gradcam = Gradcam(resnet_model, clone=True)

    # ✅ For ResNet50, last conv layer = 'conv5_block3_out'
    cam = gradcam(score, img_array, penultimate_layer=resnet_model.get_layer("conv5_block3_out"))

    # Process Grad-CAM heatmap
    heatmap = cam[0]
    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
    gradcam_base64 = encode_image_to_base64(overlay)

    response = {
        "prediction": prediction.tolist(),
        "predicted_class": decoded[0],
        "classification": decoded[1],
        "confidence": float(decoded[2]),
        "gradcam": gradcam_base64
    }
    return jsonify(response)

openai.api_key = os.getenv("GROQ_API_KEY")
openai.base_url = "https://api.groq.com/openai/v1/"  # correct base_url

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({ "reply": "Please enter a message." })

    try:
        response = openai.chat.completions.create(
            model="llama-3.1-8b-instant",  # Or use "llama3-70b-8192" if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({ "reply": reply })

    except Exception as e:
        print("Groq error:", e)
        return jsonify({ "reply": "Sorry, there was a problem connecting to the AI model." }), 500

if __name__ == "__main__":
    app.run(debug=True)
