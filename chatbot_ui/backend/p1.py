
import os
import io
import base64
import warnings
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, jsonify, request
from flask_cors import CORS
from together import Together
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import matplotlib

# Set up non-GUI backend for matplotlib and filter warnings
matplotlib.use('Agg')
warnings.simplefilter(action='ignore', category=FutureWarning)

# Load environment variables
load_dotenv()

# Securely fetch API Key
API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise ValueError("TOGETHER_API_KEY environment variable is not set.")
client = Together(api_key=API_KEY)

# Initialize Flask App and enable CORS
app = Flask(__name__)
CORS(app)

# Load Sentence Transformer model for embeddings
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Function to load CSV dataset
def load_csv(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")
    df = pd.read_csv(file_path).rename(columns=str.strip)
    required_columns = {'question', 'answer'}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"CSV file must contain the columns: {required_columns}")
    return df

# Load dataset
data_file = os.path.abspath("dataset - Sheet1.csv")  # Ensure the correct file name
df = load_csv(data_file)

# Embed dataset content
def embed_data(df):
    df["content"] = df.apply(lambda row: f"Question: {row['question']}\nAnswer: {row['answer']}", axis=1)
    df["embeddings"] = embed_model.encode(df["content"].tolist()).tolist()
    return df

df = embed_data(df)

# Retrieve the most relevant answer using cosine similarity
def retrieve_answer(df, user_query):
    query_embedding = embed_model.encode([user_query]).tolist()
    stored_embeddings = np.array(df["embeddings"].tolist())
    similarities = cosine_similarity(query_embedding, stored_embeddings)[0]
    best_match_index = np.argmax(similarities)
    
    if similarities[best_match_index] >= 0.5:  # Threshold for relevance
        return df.iloc[best_match_index]["question"], df.iloc[best_match_index]["answer"]
    return None, "I couldn't find a relevant answer."

# Generate a custom answer using Together AI API
def generate_custom_answer(user_query, relevant_question, relevant_answer):
    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3-8b-chat-hf",
            messages=[
                {"role": "system", "content": "You are an AI finance assistant. Provide accurate financial insights without markdown formatting."},
                {"role": "user", "content": relevant_question or ""},
                {"role": "assistant", "content": relevant_answer or ""},
                {"role": "user", "content": user_query}
            ],
        )
        return response.choices[0].message.content if response and response.choices else "Unable to generate an answer."
    except Exception as e:
        return f"Error generating response: {str(e)}"

# Chart generation functions
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
    return base64.b64encode(img_buf.getvalue()).decode("utf-8")

# Flask routes
@app.route("/")
def home():
    return jsonify({"message": "Welcome to FinSage API!"})

@app.route('/api/query', methods=['POST'])
def process_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request, JSON data missing"}), 400
        
        user_query = data.get('query', '').strip()
        if not user_query:
            return jsonify({"error": "Query not provided"}), 400
        
        # Retrieve relevant answer from dataset
        relevant_question, relevant_answer = retrieve_answer(df, user_query)
        
        # Generate a custom answer using Together AI
        generated_answer = generate_custom_answer(user_query, relevant_question, relevant_answer)

        # Check if query requires visualization
        chart_data = None
        lower_query = user_query.lower()
        if "pie chart" in lower_query or "expense breakdown" in lower_query:
            chart_data = {
                "type": "pie",
                "labels": ["Rent", "Food", "Transport", "Entertainment"],
                "values": [1200, 600, 300, 150],
                "image": generate_pie_chart()
            }

        return jsonify({"answer": generated_answer, "chart": chart_data})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, port=5001, threaded=True)

