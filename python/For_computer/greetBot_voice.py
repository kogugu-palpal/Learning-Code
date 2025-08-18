import tkinter as tk
from datetime import datetime
import pyttsx3
import random

from tkinter import messagebox
from PIL import Image, ImageTk


# Create window
root = tk.Tk()
root.title("Greeting Bot")
root.geometry("400x400")
root.configure(bg="#f0f8ff")

# Fonts
label_font = ("Arial", 12)
entry_font = ("Arial", 12)
button_font = ("Arial", 12, "bold")

# Themes
themes = {
    "Light": {
        "bg": "#f0f0f0",
        "fg": "#333333",
        "button_bg": "#4CAF50",
        "button_fg": "white"
    },
    "Dark": {
        "bg": "#2e2e2e",
        "fg": "white",
        "button_bg": "#1e90ff",
        "button_fg": "white"
    }
}

# Default mode: Auto
theme_mode = tk.StringVar(value="Auto")

def get_auto_theme():
    hour = datetime.now().hour
    return "Light" if 6 <= hour < 18 else "Dark"

def apply_theme():
    mode = theme_mode.get()
    theme = themes[get_auto_theme()] if mode == "Auto" else themes[mode]

    root.configure(bg=theme["bg"])
    name_label.config(bg=theme["bg"], fg=theme["fg"])
    greeting_label.config(bg=theme["bg"], fg=theme["fg"])
    greet_button.config(bg=theme["button_bg"], fg=theme["button_fg"])
    theme_label.config(bg=theme["bg"], fg=theme["fg"])
    theme_menu.config(bg=theme["bg"], fg=theme["fg"])
    # need another 2 config for image_label and lucky_button

# Greeting function
def greet():
    name = name_entry.get().strip()
    if not name:
        greeting_label.config(text="Please enter your name.")
        return

    hour = datetime.now().hour
    if hour < 12:
        time_greeting = "Good morning"
        image_path = "images/sun.png"
    elif hour < 18:
        time_greeting = "Good afternoon"
        image_path = "afternoon.png"
    else:
        time_greeting = "Good evening"
        image_path = "moon.png"

    # Cannot Load image thus must using os.path.join(script_dir, "images", "sun.png") etc. at each image_path

    greeting = f"{time_greeting}, {name}!"
    greeting_label.config(text=greeting)
   
    # Initialize TTS engine
    engine = pyttsx3.init()
# Speak aloud
    engine.say(greeting)
    engine.runAndWait()
#   engine.stop()  # Stop any previous speech

    # Load and display image
    try:
        img = Image.open(image_path)
        img = img.resize((100, 100))  # Resize if needed
        photo = ImageTk.PhotoImage(img)
        image_label.config(image=photo)
        image_label.image = photo  # Keep a reference to avoid garbage collection
    except Exception as e:
        messagebox.showerror("Image Error", f"Couldn't load image: {e}")



# Image display area
image_label = tk.Label(root, bg="#f0f8ff") # this code goes to line 130 befor Widgets
image_label.grid(row=5, column=0, columnspan=2, pady=10) # this code goes inside the layout section


# Set up Lucky Drew feature
def lucky_greet():
    messages = [
        "Hey superstar! ",
        "You are doing amazing today!",
        "The world is lucky to have you!",
        "Ready to rock this day? ",
        "Let is make today count!",
        "You got this!",
        "Be kind, be bold, be you.",
        "You shine brighter than my screen!",
        "Keep smiling, it suits you ",
    ]
    g_luck = random.choice(messages)
    greeting_label.config(text=g_luck)

    engine = pyttsx3.init()  # Reinitialize to reset any previous settings
    # Speak aloud
    engine.say(g_luck)
    engine.runAndWait()
    engine.stop()  # Stop any previous speech

# Widgets
name_label = tk.Label(root, text="Enter your name:", font=label_font)
name_entry = tk.Entry(root, font=entry_font, width=25)
greet_button = tk.Button(root, text="Greet Me", command=greet, font=button_font)
greeting_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
lucky_button = tk.Button(root, text="I'm Feeling Lucky", command=lucky_greet, font=button_font)

# Theme selector
theme_label = tk.Label(root, text="Theme Mode:", font=label_font)
theme_menu = tk.OptionMenu(root, theme_mode, "Auto", "Light", "Dark", lambda _: apply_theme())

# Layout (using grid) if use .grid all other code must use .grid if not use .pack all must use .pack
name_label.grid(row=0, column=0, padx=10, pady=20, sticky="e")
name_entry.grid(row=0, column=1, padx=10, pady=20)
greet_button.grid(row=1, column=0, columnspan=2, pady=10)
greeting_label.grid(row=2, column=0, columnspan=2, pady=20)
theme_label.grid(row=3, column=0, padx=10, pady=10, sticky="e")
theme_menu.grid(row=3, column=1, padx=10, pady=10, sticky="w")
lucky_button.grid(row=4, column=0, columnspan=2, pady=10)

# Apply theme initially
apply_theme()

# Start the app
root.mainloop()
