
# FINSAGE: AI-Powered Personal Finance Chatbot

**FinSage** is an advanced personal finance chatbot designed to empower users by offering personalized financial guidance and dynamic visualizations. By utilizing AI-driven insights, FinSage helps users make informed financial decisions, build sustainable savings habits, and reach both short- and long-term financial goals. With features such as personalized savings plans, interactive financial projections, and educational content tailored to each user's needs, FinSage enhances financial literacy. The chatbot also delivers real-time financial advice, tracks user progress, and offers easy-to-understand visualizations of spending, saving, and investment patterns, all while fostering financial confidence and independence.




## Features

- *Personalized Financial Advice:* Tailored guidance to help manage finances and reach goals.

- *Dynamic Visualizations:* Interactive charts (pie, scatter, bar, box) for deeper insights.

- *NLP Integration:* Efficiently processes and understands user queries.

- *RAG (Retrieval-Augmented Generation):* Uses Together AI’s RAG for accurate, context-aware responses.

- *Embeddings with SentenceTransformers:* Provides relevant answers via semantic similarity.

- *Streamlit Interface:* Easy-to-use web interface for seamless interaction.

- *ReactJS Frontend:* Modern, responsive design for a better user experience.



## Screenshots

### Screenshot 1: Description of what this screenshot shows
![Screenshot 1](Screenshots/Screenshot(3).png)

### Screenshot 2: Description of what this screenshot shows
![Screenshot 2](Screenshots/Screenshot2.png)

### Screenshot 3: Description of what this screenshot shows
![Screenshot 3](Screenshots/Screenshot3.png)





## Setup Guide

Follow these steps to set up and run the project locally:

## 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/RonitJariwala/FinSage.git
cd FinSage
```

## 2. Set up the backend

 Navigate to the backend directory:

  ```bash
  cd backend
  ```

Install the required dependencies using `pip`:

  ```bash
  pip install -r requirements.txt
  ```

Run the backend server:

  ```bash
  streamlit run app.py
  ```

## 3. Set up the frontend:

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```
## Tech Stack

- **Python**: Used for backend development and data processing.
- **Streamlit**: For building interactive web applications with the backend.
- **ReactJS**: For frontend development, creating dynamic and responsive UIs.
- **SentenceTransformers**: Utilized for natural language processing and generating sentence embeddings.
- **Together AI’s RAG Pipeline**: Used for the retrieval-augmented generation (RAG) pipeline in the chatbot for efficient question-answering.

