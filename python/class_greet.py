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
            self.image_label.config(image=self.imageByTime["sun"])
            #self.image_label.image = self.imageByTime["sun"]  # Keep a reference
        elif self.hour < 18:
            self.time_greeting = "Good afternoon"
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
        image_path = os.path.join(script_dir, "sun.png")
        # Load the image using PIL
        
        image_files = ["sun.png", "afternoon.png", "moon.png"]
        count = 3
        while count > 0:
            try:
                img = Image.open(image_files)
                img = img.resize((200, 200), Image.LANCZOS)
                photo_image = ImageTk.PhotoImage(img)     
                self.imageByTime["sun"] = photo_image
                photo_image = ImageTk.PhotoImage(img)     
                self.imageByTime["afternoon"] = photo_image
                photo_image = ImageTk.PhotoImage(img) 
                self.imageByTime["moon"] = photo_image
                break
            except FileNotFoundError:
                print(f"Image not found at {image_path}. Please check the path.")
                count -= 1
                if count == 0:
                    return
        
        """        
        #img = Image.open(image_path)
        img = img.resize((200, 200), Image.LANCZOS)  # Resize the image to fit the label
        # load Image to PhotoImage and store it in the dictionary
        photo_image = ImageTk.PhotoImage(img)     
        self.imageByTime["sun"] = photo_image
        photo_image = ImageTk.PhotoImage(img)     
        self.imageByTime["afternoon"] = photo_image
        photo_image = ImageTk.PhotoImage(img) 
        self.imageByTime["moon"] = photo_image

        self.imageByTime = {
            "sun": photo_image,
            "afternoon": photo_image,
            "moon": photo_image
            }"""




    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    my_bot = GreetingBot()
    my_bot.run()