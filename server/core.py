import os
import sys
import numpy
import uuid
import time

from .grid import HexGrid, HexCoord, HexCell

class User:
    def __init__(self, init_cell: HexCell):
        self.cell = init_cell
        self.history = [init_cell]
        self.uuid = uuid.uuid4()
    
    def move(self, cell: HexCell):
        self.cell = cell
        self.history.append(cell)
    
    def to_dict(self):
        return {
            "uuid": str(self.uuid),
            "cell": self.cell.to_dict()
        }
    
    def __repr__(self):
        return str(self.uuid)

class HoneycombManager():

    def __init__(self):
        self.grid = HexGrid()
        self.users = {}
        self.reset_timestamp = time.time()

        # print(self.grid.grid)

    def add_user(self, location=None):
        if location is None:
            cell = self.grid.get_random_cell()
        else:
            cell = self.grid.get_cell(HexCoord(location[0], location[1], location[2]))
        new_user = User(cell)
        self.users[new_user.uuid] = new_user
        print(f"Added User {new_user} at location {cell}")
        return new_user

    def remove_user(self, uuid):
        if uuid in self.users:
            user = self.users[uuid]
            del self.users[uuid]
            print(f"Removing User {user}")
    
    def get_grid_state(self):
        return {
            "timestamp": self.reset_timestamp,
            "users": [u.to_dict() for u in self.users.values()]
        }

    def run_monitor(self):
        # Run every second
        self.reset_timestamp = time.time()



if __name__=="__main__":
    h = HoneycombManager()
    
