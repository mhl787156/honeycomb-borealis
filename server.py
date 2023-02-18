from flask import Flask, request, render_template
from server.core import HoneycombManager
import json

app = Flask(__name__, static_url_path='/s/', static_folder='static')

manager = HoneycombManager()

# Create a URL route in our application for "/"
@app.route('/new_participant', methods = ['GET'])
def new_participants():
    if request.method == 'GET':
        """Add a new participants"""
        user = manager.add_user()
        return json.dumps(user.to_dict())
        pass

@app.route('/participant/<user_id>', methods = ['GET', 'POST', 'DELETE'])
def participant(user_id):
    if request.method == 'POST':
        """Get or Remove a participant"""
        data = request.form # a multidict containing POST data
        if data["function"] == "DELETE":
            user = manager.get_user(user_id)
            return json.dumps(user.to_dict())
        elif data["function"] == "GET":
            manager.remove_user(user_id)
    else:
        pass

# Create a URL route in our application for "/"
@app.route("/grid", methods = ['GET', 'POST'])
def get_grid():
    if request.method == 'GET':
        """return current state of the system"""
        # userId = request.args.get('user_id')
        grid = manager.grid.to_dict()
        return json.dumps(grid)
    elif request.method == 'POST':
        # Modify backend to match frontend
        pass
    else:
        pass

# Create a URL route in our application for "/"
@app.route("/state", methods = ['GET'])
def state():
    if request.method == 'GET':
        """return current state of the system"""
        # userId = request.args.get('user_id')
        state = manager.get_grid_state()
        return json.dumps(state)
    else:
        pass

# Create a URL route in our application for "/"
@app.route("/move/<user_id>", methods = ['GET', 'POST'])
def move(user_id):
    if request.method == 'GET':
        """return current state of the system"""
        pass
        # userId = request.args.get('user_id')
    else:
        pass

# Transforms the state variables to latent space
@app.route("/latent", methods = ['GET', 'POST'])
def getMusicData():
    if request.method == 'GET':
        """return latent space variables"""
        ts = [0,10,25,0,0,0,0,0,0,5,0]
        data = {
            "Ab":ts[0],
            "A":ts[1],
            "B":ts[2],
            "Bb":ts[3],
            "C#":ts[4],
            "Db":ts[5],
            "D":ts[6],
            "E":ts[7],
            "F":ts[8],
            "Fb":ts[9],
            "G":ts[10]
        }

        proc = processMusic(data)
        # timestamp_of_call = 
        data['consonance_measure'] = proc['consonance_measure']
        data['complexity'] = proc['complexity']
        return data
        # userId = request.args.get('user_id')
    else:
        pass

import random
def processMusic(data):
    r1 = random.uniform(0,1)
    r2 = random.uniform(0,1)
    # consonance_measure = #0-1
    # complexity = #0-1
    return {
        'consonance_measure': r1,
        'complexity': r2
    }

# seasons
# base tempo
# number of participants


@app.route("/dome")
def dome():
    return render_template("viz/dome.html", template_folder="templates")


@app.route("/interaction")
def interaction_homepage():
    return render_template("interaction/main.html", template_folder="templates")



app.run(port=5000, debug=True)