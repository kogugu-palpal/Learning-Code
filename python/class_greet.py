import tkinter as tk
from datetime import datetime
from PIL import Image, ImageTk
import pyttsx3
import random
import os


class GreetingBot():
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
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Greeting Bot")
        self.root.geometry("450x500")

        self.theme_mode = tk.StringVar(value="Auto")
        self.theme_mode.trace_add("write", self.apply_theme)

        # Create a dictionary to store images by time of day
        self.imageByTime = {}

        # Add widget
        self.theme_label = tk.Label(self.root, text="Select your Themes:")
        self.theme_label.pack(pady=10) 
        self.theme_menu = tk.OptionMenu(self.root, self.theme_mode, "Auto", "Light", "Dark")
        self.theme_menu.pack(pady=10)
        self.name_label = tk.Label(self.root, text="Enter your name:")
        self.name_label.pack(pady=10)
        self.name_entry = tk.Entry(self.root)
        self.name_entry.pack(pady=10)
        self.clear_button = tk.Button(self.root, text="Clear Name", command=self.clear_name)
        self.clear_button.pack(pady=10)
        self.greet_button = tk.Button(self.root, text="Hello", command=self.greet)
        self.greet_button.pack(pady=10)
        self.greeting_label = tk.Label(self.root, text="")
        self.greeting_label.pack(pady=10)     
        self.image_label = tk.Label(self.root)
        self.image_label.pack(pady=10)

        self.load_image() # Load the image at initialization

    def get_auto_theme(self):
        hour = datetime.now().hour
        return "Light" if 6 <= hour < 18 else "Dark"
    
    def apply_theme(self, *args):
        mode = self.theme_mode.get() # Use self to access the theme_mode variable
        # Use self to access the themes and the get_auto_theme method
        theme = self.themes[self.get_auto_theme()] if mode == "Auto" else self.themes[mode]
        # Now, use self to configure all your widgets
        self.root.configure(bg=theme["bg"])
        self.name_label.config(bg=theme["bg"], fg=theme["fg"])
        self.greeting_label.config(bg=theme["bg"], fg=theme["fg"])

    def clear_name(self):
        self.name_entry.delete(0, tk.END)

    def greet(self):
        self.name = self.name_entry.get().strip()
        if not self.name:
            self.greeting_label.config(text="Please enter your name.")
            return
        self.hour = datetime.now().hour
        if self.hour < 12:
            self.time_greeting = "Good morning"
            #self.image_label.config(image="filename")
            self.image_label.config(image=self.imageByTime["sun"]) # Keep a reference
        elif self.hour < 18:
            self.time_greeting = "Good afternoon"
            #self.image_label.config(image="filename")
            self.image_label.config(image=self.imageByTime["afternoon"])
        else:
            self.time_greeting = "Good evening"
            self.image_label.config(image=self.imageByTime["moon"])

        self.greeting = f"{self.time_greeting}, {self.name}!"
        self.greeting_label.config(text=self.greeting)


        #self.image_label.config(image=self.imageByTime)        
  
    def load_image(self, *args):
        # where do run this program to get image and tell image path
        script_dir = os.path.dirname(os.path.abspath(__file__))


        image_files = ["sun.png", "afternoon.png", "moon.png"]
        for filename in image_files:
            # get full image file path
            image_path = os.path.join(script_dir, "images", filename)

            # open the image file
            img = Image.open(image_path)
            
            # resize image
            img = img.resize((150, 150), Image.LANCZOS)

            # convert the image to photo
            photo_image = ImageTk.PhotoImage(img)

            # Add that to dictionary
            key = filename.split('.')[0]
            self.imageByTime[key] = photo_image



    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    my_bot = GreetingBot()
    my_bot.run()