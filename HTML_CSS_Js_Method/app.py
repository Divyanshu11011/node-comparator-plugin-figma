from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import base64
import requests

app = Flask(__name__)
CORS(app)

api_key = ""

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/save-node', methods=['POST'])
def save_node():
    data = request.json
    with open('data.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
    return jsonify({"status": "success"}), 200

@app.route('/initiate-semantic-tagging', methods=['POST'])
def initiate_semantic_tagging():
    data = request.json
    with open('data.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)

    image_path = "ss.png"
    base64_image = encode_image(image_path)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "You are an expert in Figma JSON analysis, specializing in identifying and mapping design components to corresponding images. "
                            "Your expertise includes converting elements like cards, boxes, display buttons, icons, and more into meaningful and semantic classnames. "
                            "Given an image and a Figma JSON file, your role is to analyze the structure and components, accurately identify each element, and assign suitable classnames that reflect their design and functionality. "
                            "The end goal is to return an improved JSON file with enhanced semantic tagging and meaningful classnames, ensuring the provided Figma file is well-organized and easily interpretable for further development and styling. "
                            "The output should only consist of the complete JSON file with no missing content and no additional words or explanations. The output is saved directly as JSON, so any extraneous words or phrases would result in an incorrect output."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    },
                    {
                        "type": "text",
                        "text": json.dumps(data)
                    }
                ]
            }
        ],
        "max_tokens": 4096
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    try:
        response_json = response.json()
        # Extract the content from the response
        content = response_json['choices'][0]['message']['content']
        # Remove the ```json and ``` around the content
        content = content.strip("```json").strip("```").strip()
        # Parse the cleaned content to JSON
        semantic_data = json.loads(content)
        # Save the parsed content as semantic-data.json
        with open('semantic-data.json', 'w') as output_file:
            json.dump(semantic_data, output_file, indent=4)
        return jsonify(semantic_data), 200
    except (ValueError, KeyError) as e:
        print(f"Error parsing response: {e}")
        print(f"Response content: {response.content}")
        return jsonify({"error": "Failed to process semantic tagging"}), 500

if __name__ == '__main__':
    app.run(debug=True)
