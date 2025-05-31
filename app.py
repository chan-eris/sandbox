from todo import TodoItem

def main():
    tasks = []

    while True:
        print("\nOptions: add <task>, list, complete <task_id>, exit")
        command_input = input("> ").strip().lower()
        parts = command_input.split(" ", 1)
        command = parts[0]

        if command == "add":
            if len(parts) > 1 and parts[1]:
                description = parts[1]
                tasks.append(TodoItem(description))
                print("Task added.")
            else:
                print("Please provide a task description after 'add'.")
        elif command == "list":
            if not tasks:
                print("No tasks yet.")
            else:
                for i, task in enumerate(tasks):
                    print(f"{i + 1}. {task}")
        elif command == "complete":
            if len(parts) > 1 and parts[1]:
                try:
                    task_id = int(parts[1])
                    if 1 <= task_id <= len(tasks):
                        tasks[task_id - 1].mark_complete()
                        print("Task marked as complete.")
                    else:
                        print("Invalid task ID. Out of bounds.")
                except ValueError:
                    print("Invalid task ID. Please enter a number.")
            else:
                print("Please provide a task ID after 'complete'.")
        elif command == "exit":
            print("Exiting application.")
            break
        else:
            print("Invalid command. Please try again.")

if __name__ == "__main__":
    main()
