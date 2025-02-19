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

# Set up non-GUI backend for matplotlib
matplotlib.use('Agg')
warnings.simplefilter(action='ignore', category=FutureWarning)

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Securely fetch API Key
API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise ValueError("TOGETHER_API_KEY environment variable is not set.")
client = Together(api_key=API_KEY)

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

# Load dataset
data_file = os.path.abspath("dataset - Sheet1.csv")
df = load_csv(data_file)

# Embed data for similarity search
def embed_data(df):
    df["content"] = df.apply(lambda row: f"Question: {row['question']}\nAnswer: {row['answer']}", axis=1)
    df["embeddings"] = embed_model.encode(df["content"].tolist()).tolist()
    return df

df = embed_data(df)

# Retrieve the most relevant answer from the dataset
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

# Function to generate a line chart for monthly savings
def generate_line_chart():
    labels = ["Jan", "Feb", "Mar", "Apr", "May"]
    values = [2000, 3000, 4000, 3500, 4500]

    plt.figure(figsize=(6, 4))
    plt.plot(labels, values, marker='o', color='blue', linewidth=2)
    plt.fill_between(labels, values, color='skyblue', alpha=0.4)
    plt.title("Monthly Savings Trend")
    plt.xlabel("Month")
    plt.ylabel("Savings")
    plt.grid(True)

    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    plt.close()

    img_buf.seek(0)
    encoded_image = base64.b64encode(img_buf.getvalue()).decode("utf-8")
    return encoded_image

# Function to generate a stacked bar chart for expenses
def generate_stacked_bar_chart():
    # Example data for stacked bar chart
    categories = ["Rent", "Food", "Transport", "Entertainment"]
    fixed = [1200, 600, 300, 150]
    variable = [300, 200, 100, 50]

    ind = np.arange(len(categories))
    width = 0.5

    plt.figure(figsize=(6, 4))
    plt.bar(ind, fixed, width, label='Fixed', color='skyblue')
    plt.bar(ind, variable, width, bottom=fixed, label='Variable', color='lightgreen')
    plt.ylabel("Expenses")
    plt.title("Monthly Expenses by Category")
    plt.xticks(ind, categories)
    plt.legend()

    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    plt.close()

    img_buf.seek(0)
    encoded_image = base64.b64encode(img_buf.getvalue()).decode("utf-8")
    return encoded_image

# Function to generate a scatter plot for financial comparison
def generate_scatter_plot():
    # Example data for scatter plot: Income vs. Spending
    x = [3000, 4000, 3500, 5000, 4500]  # Income values
    y = [2000, 2500, 2200, 3000, 2800]  # Spending values

    plt.figure(figsize=(6, 4))
    plt.scatter(x, y, color='red')
    plt.title("Income vs. Spending")
    plt.xlabel("Income")
    plt.ylabel("Spending")
    plt.grid(True)

    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    plt.close()

    img_buf.seek(0)
    encoded_image = base64.b64encode(img_buf.getvalue()).decode("utf-8")
    return encoded_image

# Home route
@app.route("/")
def home():
    return jsonify({"message": "Welcome to FinSage API!"})

# Query processing route
@app.route('/api/query', methods=['POST'])
def process_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request, JSON data missing"}), 400
        
        user_query = data.get('query', '').strip()
        if not user_query:
            return jsonify({"error": "Query not provided"}), 400
        
        # Retrieve relevant answer from the dataset
        relevant_question, relevant_answer = retrieve_answer(df, user_query)
        
        # Generate a custom answer using Together AI
        generated_answer = generate_custom_answer(user_query, relevant_question, relevant_answer)

        # Check if query requires visualization
        chart_data = None
        lower_query = user_query.lower()
        if "pie chart" in lower_query or "expense breakdown" in lower_query:
            chart_data = {
                "type": "pie",
                "proportions": True,
                "labels": ["Rent", "Food", "Transport", "Entertainment"],
                "values": [1200, 600, 300, 150],
                "image": generate_pie_chart()  # Base64 encoded image
            }
        elif "line chart" in lower_query or "line graph" in lower_query or "trend" in lower_query:
            chart_data = {
                "type": "line",
                "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
                "values": [2000, 3000, 4000, 3500, 4500],
                "image": generate_line_chart()  # Base64 encoded image
            }
        elif "stacked bar" in lower_query or "stacked bar chart" in lower_query:
            chart_data = {
                "type": "stacked",
                "labels": ["Rent", "Food", "Transport", "Entertainment"],
                "fixed": [1200, 600, 300, 150],
                "variable": [300, 200, 100, 50],
                "image": generate_stacked_bar_chart()  # Base64 encoded image
            }
        elif "scatter plot" in lower_query or "scatter" in lower_query:
            chart_data = {
                "type": "scatter",
                "x": [3000, 4000, 3500, 5000, 4500],
                "y": [2000, 2500, 2200, 3000, 2800],
                "image": generate_scatter_plot()  # Base64 encoded image
            }

        return jsonify({"answer": generated_answer, "chart": chart_data})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Dashboard data route
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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)
