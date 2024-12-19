import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import matplotlib.pyplot as plt
import seaborn as sns
from together import Together
import streamlit as st

# Initialize the Together API client
client = Together(api_key="your_api_key")

# Initialize embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip()  # Clean column names (remove leading/trailing spaces)
        st.write("Data loaded successfully!")
        return df
    except Exception as e:
        st.error(f"Error loading CSV file: {e}")
        return None

def embed_data(df):
    try:
        # Ensure lowercase column names
        df.columns = df.columns.str.lower()
        
        # Create content column
        df["content"] = df.apply(lambda row: f"Question: {row['question']}\nAnswer: {row['answer']}", axis=1)
        
        # Generate embeddings
        contents = df["content"].tolist()
        embeddings = embed_model.encode(contents)
        
        # Convert embeddings to list of lists for compatibility
        df["embeddings"] = embeddings.tolist()
        
        return df
    except Exception as e:
        st.error(f"Error embedding content: {e}")
        return df

# Retrieval Process Starts
def retrieve_answer(df, user_query):
    # Ensure embeddings are created
    if 'embeddings' not in df.columns:
        df = embed_data(df)
    
    # Generate query embedding
    query_embedding = embed_model.encode([user_query]).tolist()
    
    # Convert stored embeddings to numpy array for cosine similarity
    stored_embeddings = np.array(df["embeddings"].tolist())
    
    # Calculate similarities
    similarities = cosine_similarity(query_embedding, stored_embeddings)[0]
    
    # Find best match
    best_match_index = np.argmax(similarities)
    relevant_question = df.iloc[best_match_index]["question"]
    relevant_answer = df.iloc[best_match_index]["answer"]
    
    return relevant_question, relevant_answer

# Generation Process Starts
def generate_custom_answer_together(user_query, relevant_question, relevant_answer):
    response = client.chat.completions.create(
        model="meta-llama/Llama-3-8b-chat-hf",
        messages=[ 
            {"role": "system", "content": "You are a personal finance assistant that provides all responses in Indian Rupees (INR)."},
            {"role": "user", "content": relevant_question},
            {"role": "assistant", "content": relevant_answer},
            {"role": "user", "content": user_query}
        ],
    )
    generated_answer = response.choices[0].message.content
    return generated_answer

# Visualization handling
def handle_visualization_request(user_query, df):
    user_query = user_query.lower()

    # Define synonyms for each chart type
    pie_synonyms = ["pie", "proportions", "distribution", "segments", "pie chart", "slice", "percentage"]
    scatter_synonyms = ["scatter", "scatterplot", "cloud", "points", "scatter graph", "scatter chart", "xy plot", "dots"]
    box_synonyms = ["box", "boxplot", "distribution", "quartiles", "box chart", "box and whisker", "spread"]
    bar_synonyms = ["bar", "bar graph", "histogram", "column", "bar chart", "bars", "frequency chart"]

    # Visualization handlers
    if any(word in user_query for word in pie_synonyms):
        categories = st.text_input("Enter categories (comma-separated):")
        amounts = st.text_input("Enter amounts for each category (comma-separated):")
        if categories and amounts:
            try:
                categories_list = [cat.strip() for cat in categories.split(',')]
                amounts_list = list(map(float, amounts.split(',')))
                if len(categories_list) == len(amounts_list):
                    plot_expense_breakdown(categories_list, amounts_list)
                else:
                    st.error("Number of categories must match number of amounts.")
            except ValueError:
                st.error("Please enter valid numerical amounts.")

    elif any(word in user_query for word in scatter_synonyms):
        x_data = st.text_input("Enter x values (comma-separated):")
        y_data = st.text_input("Enter y values (comma-separated):")
        if x_data and y_data:
            try:
                x_values = list(map(float, x_data.split(',')))
                y_values = list(map(float, y_data.split(',')))
                plot_scatter_plot(x_values, y_values)
            except ValueError:
                st.error("Please enter valid numerical values for x and y.")

    elif any(word in user_query for word in box_synonyms):
        data = st.text_input("Enter values for box plot (comma-separated):")
        if data:
            try:
                box_values = list(map(float, data.split(',')))
                plot_box_plot(box_values)
            except ValueError:
                st.error("Please enter valid numerical values.")

    elif any(word in user_query for word in bar_synonyms):
        categories = st.text_input("Enter categories (comma-separated):")
        values = st.text_input("Enter values for each category (comma-separated):")
        if categories and values:
            try:
                category_list = [cat.strip() for cat in categories.split(',')]
                value_list = list(map(float, values.split(',')))
                if len(category_list) == len(value_list):
                    plot_bar_graph(category_list, value_list)
                else:
                    st.error("Number of categories must match number of values.")
            except ValueError:
                st.error("Please enter valid numerical values for each category.")

# Visualization functions
def plot_scatter_plot(x, y):
    fig, ax = plt.subplots()
    ax.scatter(x, y)
    ax.set_title('Scatter Plot')
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    st.pyplot(fig)

def plot_box_plot(data):
    fig, ax = plt.subplots()
    sns.boxplot(data=data, ax=ax)
    ax.set_title('Box Plot')
    st.pyplot(fig)

def plot_bar_graph(categories, values):
    fig, ax = plt.subplots()
    ax.bar(categories, values)
    ax.set_title('Bar Graph')
    ax.set_xlabel('Categories')
    ax.set_ylabel('Values')
    st.pyplot(fig)

def plot_expense_breakdown(categories, values):
    fig, ax = plt.subplots()
    ax.pie(values, labels=categories, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  # Equal aspect ratio ensures the pie chart is circular.
    plt.title('Expense Breakdown')
    st.pyplot(fig)

# Main Streamlit app
def main():
    st.title("FinSage")
    
    st.markdown(
        "Welcome to **FinSage**, your personal finance assistant chatbot designed to help you improve your financial habits and make informed decisions!"
    )

    # Load CSV file directly
    df = load_csv("dataset - Sheet1.csv")  # Provide the direct path to your CSV file
    if df is not None:
        # Embed data before processing
        df = embed_data(df)
        
        # Only display the query input, no data output
        user_query = st.text_input("Ask your finance-related question:")

        if user_query:
            relevant_question, relevant_answer = retrieve_answer(df, user_query)
            generated_answer = generate_custom_answer_together(user_query, relevant_question, relevant_answer)

            st.write(f"Answer: {generated_answer}")

            # Handle any visualization requests
            handle_visualization_request(user_query, df)

# Run Streamlit app
if __name__ == "__main__":
    main()
