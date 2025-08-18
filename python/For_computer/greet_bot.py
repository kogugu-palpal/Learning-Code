import tkinter as tk
from tkinter import font
from datetime import datetime

# Check time to decide theme
hour = datetime.now().hour
if 6 <= hour < 18:
    theme = "light"
else:
    theme = "dark"


# Create window
root = tk.Tk()
root.title("Greeting Bot")
root.geometry("400x350")  # Width x Height
#root.configure(bg="#f0f0f0")  # Light grey background (that is fixed light theme)


# font
label_font = ("Arial", 12)
entry_font = ("Arial", 12)
button_font = ("Arial", 12, "bold")

# Theme configuration
themes = {
    "light": {
        "bg": "#f0f0f0",
        "fg": "#333",
        "button_bg": "#4CAF50",
        "button_fg": "white"
    },
    "dark": {
        "bg": "#333",
        "fg": "#f0f0f0",
        "button_bg": "#555",
        "button_fg": "white"
    }
}

# Default theme settings
theme_mode = tk.StringVar(value="Auto")

def get_auto_theme():
    hour = datetime.now().hour
    return "light" if 6 <= hour < 18 else "dark"
# Apply theme based on time

# Custom function to apply theme
def apply_theme():
    mode = theme_mode.get()
    if mode == "Auto":
        theme = themes[get_auto_theme()]
    else:
        theme = themes[mode]

# If write code in one-line style,':' does not need to be used at if condition. It is called "one-liner if statement". eg. "theme = themes[get_auto_theme()] if mode == "Auto" else themes[mode]". If use if condition in multiple lines, then ':' is needed.It is called "multi-line if expression".

    root.configure(bg=theme["bg"])
    name_label.config(bg=theme["bg"], fg=theme["fg"])
    greeting_label.config(bg=theme["bg"], fg=theme["fg"])
    greet_button.config(bg=theme["button_bg"], fg=theme["button_fg"])
    theme_label.config(bg=theme["bg"], fg=theme["fg"])
    theme_menu.config(bg=theme["button_bg"], fg=theme["button_fg"], highlightbackground=theme["bg"])


# Greeting function
def greet():
    name = name_entry.get().strip()
    if not name:
        greeting_label.config(text="Please enter your name.")
        return

    hour = datetime.now().hour
    if hour < 12:
        time_greeting = "Good morning"
    elif hour < 18:
        time_greeting = "Good afternoon"
    else:
        time_greeting = "Good evening"

    greeting = f"{time_greeting}, {name}!"
    greeting_label.config(text=greeting)

# Widgets
name_label = tk.Label(root, text="Enter your name:", font=label_font,)
name_entry = tk.Entry(root, font=entry_font, width=25)
greet_button = tk.Button(root, text="Greet Me", command=greet, font=button_font,)
greeting_label = tk.Label(root, text="", font=("Arial", 14, "bold"))

# Theme selection
theme_label = tk.Label(root, text="Select Theme:", font=label_font)
theme_menu = tk.OptionMenu(root, theme_mode, "Auto", "light", "dark", command=lambda _: apply_theme())


# Layout with grid
name_label.grid(row=0, column=0, padx=10, pady=20, sticky="e")
name_entry.grid(row=0, column=1, padx=10, pady=20)

greet_button.grid(row=1, column=0, columnspan=2, pady=10)
greeting_label.grid(row=2, column=0, columnspan=2, pady=20)

theme_label.grid(row=3, column=0, padx=10, pady=10, sticky="e")
theme_menu.grid(row=3, column=1, padx=10, pady=10, sticky="w")

# Apply initial theme
apply_theme()


# Run the app
root.mainloop()
