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
        data = {
            "Ab",
            "A",
            "B",
            "Bb",
            "C#",
            "Db",
            "D",
            "E",
            "F",
            "Fb",
            "G"
        }   
        pass
        # userId = request.args.get('user_id')
    else:
        pass

# def processNotes():
# consonance_measure = #0-1
# complexity = 
# timestamp_of_call = 
# number_of_notes = 

# seasons
# base tempo


@app.route("/dome")
def dome():
    return render_template("viz/dome.html", template_folder="templates")


@app.route("/interaction")
def interaction_homepage():
    return render_template("interaction/main.html", template_folder="templates")



app.run(port=5000, debug=True)