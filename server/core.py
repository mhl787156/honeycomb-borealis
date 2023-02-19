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
        self.cell.activate()
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

    def add_user(self, location=(0, 0, 0)):
        if location is None:
            cell = self.grid.get_random_cell()
        else:
            cell = self.grid.get_cell(HexCoord(location[0], location[1], location[2]))
        new_user = User(cell)
        self.users[str(new_user.uuid)] = new_user
        print(f"Added User {new_user} at location {cell}")
        return new_user

    def remove_user(self, uuid):
        if uuid in self.users:
            user = self.users[uuid]
            del self.users[uuid]
            print(f"Removing User {user}")
        
    def move_user(self, uuid, location):
        print(f"looking for uuid {uuid} in {self.users}")
        if uuid in self.users:
            user = self.users[uuid]
            cell = self.grid.get_cell(HexCoord(location[0], location[1], location[2]))
            if cell:
                user.move(cell)
                print(f"Moved User {user} to cell {cell}")
            else:
                print(f"Attempted to move user {user} to location {location}, location not found")
    
    def get_grid_state(self):
        return {
            "timestamp": self.reset_timestamp,
            "users": [u.to_dict() for u in self.users.values()]
        }

    def getMusicData(self):
        # # Assume users are somewhere on the grid
        # # Get all active cells
        # active_cells = []
        return self.grid.current_active_cells()



if __name__=="__main__":
    h = HoneycombManager()
    
