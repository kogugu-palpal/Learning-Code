import tkinter as tk
from tkinter import messagebox

# Function to generate greeting
def greet_user():
    name = name_entry.get().title().strip()
    time = time_entry.get().lower().strip()

    if time not in ["morning", "afternoon", "evening"]:
        messagebox.showerror("Invalid Time", "Please enter: morning, afternoon, or evening.")
        return

    if time == "morning":
        greeting = f"Good morning, {name}! ☀️ Have a bright day ahead!"
    elif time == "afternoon":
        greeting = f"Good afternoon, {name}! 🌤️ Hope your day is going well!"
    elif time == "evening":
        greeting = f"Good evening, {name}! 🌙 Relax and enjoy your night!"

    greeting_label.config(text=greeting)

# Create GUI window
root = tk.Tk()
root.title("Greeting Bot")
root.geometry("400x250")

# Name input
tk.Label(root, text="What's your name?").pack(pady=5)
name_entry = tk.Entry(root, width=30)
name_entry.pack()

# Time of day input
tk.Label(root, text="What time of day? (morning, afternoon, evening)").pack(pady=5)
time_entry = tk.Entry(root, width=30)
time_entry.pack()

# Greet button
greet_button = tk.Button(root, text="Greet Me!", command=greet_user)
greet_button.pack(pady=10)

# Greeting result
greeting_label = tk.Label(root, text="", font=("Arial", 12), wraplength=300)
greeting_label.pack(pady=10)

# Run the app
root.mainloop()
