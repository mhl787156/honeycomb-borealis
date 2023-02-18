from __future__ import annotations
import numpy as np
from typing import List
from musicpy import N

class HexCoord:

    # HexCoordinates on a cube: https://www.redblobgames.com/grids/hexagons/#neighbors
    def __init__(self, p: int, q: int, r:int):
        self.coord = np.array([p, q, r])
        self.p = p
        self.q = q
        self.r = r
    
    def as_tuple(self):
        return (self.p, self.q, self.r)

    def __hash__(self):
        return hash(self.as_tuple())

    def __eq__(self, other):
        return self.as_tuple() == other.as_tuple()
    
    def neighbours(self) -> List[HexCoord]:
        neighbour_vecs = [
            np.array([1, 0 ,1]),
            np.array([1, -1, 0]),
            np.array([0, -1, 1]),
            np.array([-1, 0, 1]),
            np.array([-1, 1, 0]),
            np.array([0, 1, -1])
        ]

        return [self.__add__(HexCoord(v[0], v[1], v[2])) for v in neighbour_vecs]

    def __add__(self, coord: HexCoord):
        return HexCoord(self.p + coord.p, self.q+coord.q, self.r+coord.r)

    def __sub__(self, coord: HexCoord):
        return HexCoord(self.p - coord.p, self.q-coord.q, self.r-coord.r)

    def is_smaller_than(self, limit):
        return abs(self.p) < limit and abs(self.q) < limit and abs(self.r) < limit
    
    def __repr__(self):
        return f"H{self.as_tuple()}"

class HexCell:

    def __init__(self,coord: HexCoord, note):
        self.coord = coord
        self.note = note
    
    def to_dict(self):
        return {
            "coord": list(self.coord.as_tuple()),
            "note": self.note.name
        }

    def __eq__(self, other):
        return self.note == other.note and self.coord == other.coord
    
    def __hash__(self):
        return hash(self.__repr__())
    
    def __repr__(self):
        return f"{self.coord}-{self.note}"

class HexGrid:

    def __init__(self, size=8, center_note = 'C5', axis_rules_semitones=(3, 7, 4)):
        self.size = size
        self.center_note = center_note
        # By default this corresponds to major third (Upper Right), Fifth (Right), minor third (Lower Right)
        self.axis_rules_semitones = axis_rules_semitones
        self.grid = self.__generate_grid()

    def __generate_grid(self):

        grid = {} # Mapping between HexCell and HexCell
        
        start_coord = HexCoord(0, 0, 0)
        cell = HexCell(start_coord, N(self.center_note))

        directions = [
            (0, 1, HexCoord(1, -1 ,0)),
            (1, 1, HexCoord(1, 0, -1)),
            (2, 1, HexCoord(0, 1, -1)),
            (0, -1, HexCoord(-1, 1, 0)),
            (1, -1, HexCoord(-1, 0, 1)),
            (2, -1, HexCoord(0, -1, 1))
        ]

        stack = [cell]

        while len(stack) > 0:
            
            cell = stack.pop()

            if not cell.coord.is_smaller_than(self.size):
                continue
            
            grid[cell.coord] = cell

            for dir in directions:
                
                semitone = self.axis_rules_semitones[dir[0]]
                if dir[1] > 0:
                    next_note = cell.note + semitone 
                else:
                    next_note = cell.note - semitone
                
                dir_change_coord: HexCoord = dir[2]
                new_coord = cell.coord + dir_change_coord
                
                if new_coord not in grid and new_coord.is_smaller_than(self.size):
                    new_cell = HexCell(new_coord, next_note)
                    stack.append(new_cell)

        return grid
            
    def get_cell(self, coords: HexCoord):
        return self.grid[coords]

    