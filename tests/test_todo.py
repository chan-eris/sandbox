import unittest
import sys
import os

# Adjust the Python path to include the root directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from todo import TodoItem

class TestTodoItem(unittest.TestCase):

    def test_create_item(self):
        item = TodoItem("Test task description")
        self.assertEqual(item.description, "Test task description")
        self.assertFalse(item.is_done)

    def test_mark_complete(self):
        item = TodoItem("Test task")
        self.assertFalse(item.is_done) # Ensure it's initially false
        item.mark_complete()
        self.assertTrue(item.is_done)

    def test_str_representation(self):
        item_incomplete = TodoItem("Buy milk")
        self.assertEqual(str(item_incomplete), "[ ] Buy milk")

        item_complete = TodoItem("Walk the dog")
        item_complete.mark_complete()
        self.assertEqual(str(item_complete), "[x] Walk the dog")

if __name__ == '__main__':
    unittest.main()
