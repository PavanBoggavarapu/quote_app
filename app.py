from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Predefined list of inspirational quotes (in-memory storage)
quotes = [
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"text": "Innovation distinguishes between a leader and a follower.", "author": "Steve Jobs"},
    {"text": "Life is what happens to you while you're busy making other plans.", "author": "John Lennon"},
    {"text": "Get busy living or get busy dying.", "author": "Stephen King"},
    {"text": "You only live once, but if you do it right, once is enough.", "author": "Mae West"},
    {"text": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt"},
    {"text": "It is during our darkest moments that we must focus to see the light.", "author": "Aristotle"},
    {"text": "Do not go where the path may lead, go instead where there is no path and leave a trail.", "author": "Ralph Waldo Emerson"},
    {"text": "Innovation is the ability to see change as an opportunity - not a threat.", "author": "Sachin"},
    {"text": "The best time to plant a tree was 20 years ago. The second best time is now.", "author": "Chinese Proverb"}
]

# Function to get a random quote
def get_random_quote():
    return random.choice(quotes)

@app.route('/')
def index():
    # Render the main page with an initial random quote
    initial_quote = get_random_quote()
    return render_template('index.html', quote=initial_quote)

@app.route('/random_quote', methods=['GET'])
def random_quote():
    # API endpoint to fetch a random quote as JSON
    quote = get_random_quote()
    return jsonify(quote)

@app.route('/submit_quote', methods=['POST'])
def submit_quote():
    # API endpoint to submit a new quote (POST request)
    data = request.get_json()
    new_quote = {
        "text": data.get('text', '').strip(),
        "author": data.get('author', '').strip()
    }
    # Validate input (basic check)
    if new_quote['text'] and new_quote['author']:
        quotes.append(new_quote)
        return jsonify({"success": True, "message": "Quote submitted successfully!"})
    else:
        return jsonify({"success": False, "message": "Please provide both quote text and author."}), 400

if __name__ == '__main__':
    app.run(debug=True)