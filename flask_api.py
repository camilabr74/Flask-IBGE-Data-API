from flask import Flask, request, render_template
from handle_files import load_json
 
countries = load_json("json/countries.json")
indicators = load_json("json/indicators.json")
 
app = Flask(__name__)
 
@app.route('/', methods=['GET'])
def getHome():

    data = {
            "countries": countries,
            "indicators": indicators
        }
    print(data)
    if request.method == 'GET':
            return render_template('index.html', data=data)
 
if __name__ == '__main__':
    app.run()