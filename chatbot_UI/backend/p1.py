import os
import io
import base64
import warnings
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, jsonify, request
from flask_cors import CORS
from together import Together
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import matplotlib

matplotlib.use('Agg')  # Use a non-GUI backend
warnings.simplefilter(action='ignore', category=FutureWarning)

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Securely fetch API Key
API_KEY = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=API_KEY) if API_KEY else None

# Load Sentence Transformer model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load CSV file at startup
def load_csv(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")
    df = pd.read_csv(file_path).rename(columns=str.strip)
    required_columns = {'question', 'answer'}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"CSV file must contain the columns: {required_columns}")
    return df

data_file = os.path.abspath("dataset - Sheet1.csv")
df = load_csv(data_file)

def embed_data(df):
    df["content"] = df.apply(lambda row: f"Question: {row['question']}\nAnswer: {row['answer']}", axis=1)
    df["embeddings"] = embed_model.encode(df["content"].tolist()).tolist()
    return df

df = embed_data(df)

def retrieve_answer(df, user_query):
    query_embedding = embed_model.encode([user_query]).tolist()
    stored_embeddings = np.array(df["embeddings"].tolist())
    similarities = cosine_similarity(query_embedding, stored_embeddings)[0]
    best_match_index = np.argmax(similarities)
    
    if similarities[best_match_index] >= 0.5:
        return df.iloc[best_match_index]["question"], df.iloc[best_match_index]["answer"]
    return None, "I couldn't find a relevant answer."

def generate_custom_answer(user_query, relevant_question, relevant_answer):
    if not client:
        return "AI response unavailable due to missing API key."
    
    if relevant_answer == "I couldn't find a relevant answer.":
        return relevant_answer  # Avoid sending unnecessary API calls

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3-8b-chat-hf",
            messages=[
                {"role": "system", "content": "You are an AI finance assistant. Provide accurate financial insights."},
                {"role": "user", "content": relevant_question or ""},
                {"role": "assistant", "content": relevant_answer or ""},
                {"role": "user", "content": user_query}
            ],
        )
        return response.choices[0].message.content if response and response.choices else "Unable to generate an answer."
    except Exception as e:
        return f"Error generating response: {str(e)}"

# Function to generate a pie chart for expenses
def generate_pie_chart():
    labels = ["Rent", "Food", "Transport", "Entertainment"]
    values = [1200, 600, 300, 150]

    plt.figure(figsize=(5, 5))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'])
    plt.title("Expense Breakdown")

    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    plt.close()

    img_buf.seek(0)
    encoded_image = base64.b64encode(img_buf.getvalue()).decode("utf-8")
    return encoded_image

@app.route('/api/query', methods=['POST'])
def process_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request, JSON data missing"}), 400
        
        user_query = data.get('query', '').strip()
        if not user_query:
            return jsonify({"error": "Query not provided"}), 400
        
        relevant_question, relevant_answer = retrieve_answer(df, user_query)
        generated_answer = generate_custom_answer(user_query, relevant_question, relevant_answer)

        # Check if query requires visualization
        chart_data = None
        if "pie chart" in user_query.lower() or "expense breakdown" in user_query.lower():
            chart_data = {
                "type": "pie",
                "proportions": True,  # Fixed syntax
                "labels": ["Rent", "Food", "Transport", "Entertainment"],
                "values": [1200, 600, 300, 150],
                "image": generate_pie_chart()  # Base64 encoded image
            }

        return jsonify({"answer": generated_answer, "chart": chart_data})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        savings_chart = generate_pie_chart()
        summary = {
            "total_users": 5000,
            "active_users": 3500,
            "total_transactions": 20000,
            "monthly_growth": "12.5%",
            "top_expenses": {
                "Rent": 1200,
                "Food": 600,
                "Transport": 300,
                "Entertainment": 150
            },
            "savings_chart": savings_chart
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)
