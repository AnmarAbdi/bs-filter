from flask import Flask, request, jsonify
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/parse-html', methods=['POST'])
def parse_html():
    html = request.get_data(as_text=True)
    soup = BeautifulSoup(html, 'html.parser')

    # Find the main text content based on the website's structure
    # This example assumes the main content is within a <div> with a class 'article-body'
    # You may need to adjust this according to the website's HTML structure
    article_body = soup.find('div', class_='article-body')

    if article_body:
        text = article_body.get_text(separator='\n')
    else:
        text = 'Main text content not found.'

    return jsonify({'article_text': text})

if __name__ == '__main__':
    app.run(debug=True)
