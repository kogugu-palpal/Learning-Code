import tkinter as tk
from tkinter import messagebox

# Function to generate greeting
def greet_user():
    name = name_entry.get().title().strip()
    time = time_var.get().lower().strip()

    if time not in ["morning", "afternoon", "evening"]:
        messagebox.showerror("Invalid Time", "Please select a valid time of day.")
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
root.geometry("400x400")
root.configure(bg="#b9dbf8") # Light blue background

# Font settings
label_font = ("Helvetica", 12, "bold")
entry_font = ("Helvetic", 11)
greeting_font = ("Helvetica", 12, "italic" )

# Name input
tk.Label(root, text="What's your name?", font=label_font, bg="#ef67e8").pack(pady=5)
name_entry = tk.Entry(root, width=30, font=entry_font)
name_entry.pack(pady=10)

# Time of day dropdown
tk.Label(root, text="Select time of day:", font=label_font, bg="gray").pack(pady=5)
time_var = tk.StringVar(value="Select")

time_dropdown = tk.OptionMenu(root, time_var, "morning", "afternoon", "evening")
time_dropdown.config(font=entry_font, bg="#f0f0f0", width=15)
time_dropdown["menu"].config(font=entry_font)
time_dropdown.pack()

# Greet button
greet_button = tk.Button(root, text="Greet Me!", command=greet_user, font=label_font, bg="#add8e6")
greet_button.pack(pady=10)

# Greeting result
greeting_label = tk.Label(root, text="", font=("Arial", 12), wraplength=300)
greeting_label.pack(pady=10)

# Run the app
root.mainloop()
