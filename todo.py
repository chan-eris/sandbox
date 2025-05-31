class TodoItem:
    def __init__(self, description):
        self.description = description
        self.is_done = False

    def mark_complete(self):
        self.is_done = True

    def __str__(self):
        status = "[x]" if self.is_done else "[ ]"
        return f"{status} {self.description}"
