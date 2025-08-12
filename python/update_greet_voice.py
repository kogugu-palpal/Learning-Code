import tkinter as tk
from datetime import datetime
import pyttsx3
import random
import os
from tkinter import messagebox
from PIL import Image, ImageTk

# Initialize TTS engine
# engine = pyttsx3.init() >>> this line is commented out to avoid re-initialization errors and engine only need to start when call.

# Script directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Create window
root = tk.Tk()
root.title("Greeting Bot")
root.geometry("450x500")

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
    # Update main window
    root.configure(bg=theme["bg"])
    # Update labels and entry fields
    name_label.config(bg=theme["bg"], fg=theme["fg"])
    name_entry.config(bg=theme["bg"], fg=theme["fg"],insertbackground=theme["fg"])
    greeting_label.config(bg=theme["bg"], fg=theme["fg"])
    theme_label.config(bg=theme["bg"], fg=theme["fg"])
    # Update buttons
    greet_button.config(bg=theme["button_bg"], fg=theme["button_fg"])
    lucky_button.config(bg=theme["button_bg"], fg=theme["button_fg"])
    clear_button.config(bg=theme["button_bg"], fg=theme["button_fg"]) # make sure clear button also has theme
    restart_button.config(bg=theme["button_bg"], fg=theme["button_fg"])    
    
    # Update theme menu
    theme_menu["menu"].config(bg=theme["bg"], fg=theme["fg"])
    theme_menu.config(bg=theme["bg"], fg=theme["fg"])

    image_label.config(bg=theme["bg"])

# Greeting function
def greet():
    name = name_entry.get().strip()
    if not name:
        greeting_label.config(text="Please enter your name.")
        return

    hour = datetime.now().hour
    if hour < 12:
        time_greeting = "Good morning"
        image_path = os.path.join(script_dir, "images", "sun.png")
    elif hour < 18:
        time_greeting = "Good afternoon"
        image_path = os.path.join(script_dir, "images", "afternoon.png")
    else:
        time_greeting = "Good evening"
        image_path = os.path.join(script_dir, "images", "moon.png")

    greeting = f"{time_greeting}, {name}!"
    greeting_label.config(text=greeting)

    # Initialize TTS engine
    engine = pyttsx3.init() # start engine to call speak aloud
    
    # Speak aloud
    engine.say(greeting)
    engine.runAndWait()
    # engine.stop() >>> no need to stop engine.

    # Load and display image
    try:
        img = Image.open(image_path)
        img = img.resize((100, 100))
        photo = ImageTk.PhotoImage(img)
        image_label.config(image=photo)
        image_label.image = photo
    except Exception as e:
        messagebox.showerror("Image Error", f"Couldn't load image: {e}")

# Lucky greet function
def lucky_greet():
    messages = [
        "Hey superstar! ",
        "You are doing amazing today!",
        "The world is lucky to have you!",
        "Ready to rock this day? ",
        "Let's make today count!",
        "You got this!",
        "Be kind, be bold, be you.",
        "You shine brighter than my screen!",
        "Keep smiling, it suits you ",
    ]
    g_luck = random.choice(messages)
    greeting_label.config(text=g_luck)

    # Initialize TTS engine
    engine = pyttsx3.init()  # Reinitialize to reset any previous settings

    # Speak aloud
    engine.say(g_luck)
    engine.runAndWait()

# Clear function
def clear_name():
    name_entry.delete(0, tk.END)  # A more direct way to clear the entry field
    
clear_button_bg = "#f6ec66"  # Yellow color for clear button

# create restart function to reset the app
def restart_app():
    name_entry.delete(0, tk.END)  # Clear the entry field
    greeting_label.config(text="")  # Clear the greeting label
    image_label.config(image='')  # Clear the image label
    clear_button.config(bg=clear_button_bg)  # Reset button color

restart_button_bg = "#1cfa10"  # Green color for restart button

# Widgets
name_label = tk.Label(root, text="Enter your name:", font=label_font)
name_entry = tk.Entry(root, font=entry_font, width=25)
greet_button = tk.Button(root, text="Greet Me", command=greet, font=button_font)
greeting_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
lucky_button = tk.Button(root, text="I'm Feeling Lucky", command=lucky_greet, font=button_font)
clear_button = tk.Button(root, text="Clear", command=clear_name, font=button_font, bg=clear_button_bg) # Adding clear button to clear the name entry
restart_button = tk.Button(root, text="Restart", command=restart_app, font=button_font, bg=restart_button_bg)  # Adding restart button to reset the app

# Image label (created once, updated later)
image_label = tk.Label(root, bg="#f0f0f0")

# Tell grid to expand column equally
root.grid_columnconfigure(0, weight=2)
root.grid_columnconfigure(1, weight=1)
root.grid_columnconfigure(2, weight=1)

"""
# Frame to hold the buttons together
button_frame = tk.Frame(root)
button_frame.grid(row=3, column=1)

# Add buttons to the button frame
theme_label = tk.Label(button_frame, text="Theme Mode:", font=label_font)
theme_label.pack(side="left", padx=5, pady=5)
theme_menu = tk.OptionMenu(button_frame, theme_mode, "Auto", "Light", "Dark", command=lambda _: apply_theme())
theme_menu.pack(side="right", padx=5, pady=5)
"""
# Theme selector
theme_label = tk.Label(root, text="Theme Mode:", font=label_font)
theme_menu = tk.OptionMenu(root, theme_mode, "Auto", "Light", "Dark", command=lambda _: apply_theme())

# Layout (using only grid)
# Add theme selector to the grid if not using button_frame
theme_label.grid(row=0, column=0, padx=10, pady=10, sticky="e") 
theme_menu.grid(row=0, column=1, padx=10, pady=10, sticky="w") 
# Add other widgets to the grid
name_label.grid(row=1, column=0, padx=5, pady=20, sticky="e")
name_entry.grid(row=1, column=1, padx=10, pady=20)
clear_button.grid(row=1, column=2, columnspan=2, pady=20, sticky="w")
greet_button.grid(row=2, columnspan=3, pady=10)
greeting_label.grid(row=3, columnspan=3, pady=20)
lucky_button.grid(row=5, column=0, columnspan=3, pady=10)
image_label.grid(row=6, column=0, columnspan=3, pady=10)
restart_button.grid(row=7, column=0, columnspan=3, pady=10)


# Apply theme initially
apply_theme()


# Start the app
root.mainloop()
