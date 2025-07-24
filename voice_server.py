from flask import Flask, request, jsonify
import speech_recognition as sr

app = Flask(__name__)

@app.route('/voice', methods=['POST'])
def voice():
    audio = request.files.get('file')
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio) as source:
        audio_data = recognizer.record(source)
    text = recognizer.recognize_google(audio_data)
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(port=5000)
