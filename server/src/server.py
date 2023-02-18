from flask import Flask

app = Flask(__name__)

# Create a URL route in our application for "/"
@app.route('/participants', methods = ['GET', 'POST', 'DELETE'])
def participants():
    if request.method == 'GET':
        """return current set of participants"""
        # userId = request.args.get('user_id')
        pass
    if request.method == 'POST':
        """Add a new participant"""
        # data = request.form # a multidict containing POST data
        pass
    if request.method == 'DELETE':
        """delete participant"""
        # userId = request.args.get('user_id')      
        pass
    else:
        pass

# Create a URL route in our application for "/"
@app.route("/state", methods = ['GET', 'POST'])
def state():
    if request.method == 'GET':
        """return current state of the system"""
        # userId = request.args.get('user_id')
        pass
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


app.run(port=5000)