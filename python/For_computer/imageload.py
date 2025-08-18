from PIL import Image, ImageTk
import tkinter as tk

import os
script_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(script_dir, "images", "sun.png")
img = Image.open(image_path)

root = tk.Tk()

try:
    img = Image.open("sun.png")
    img = img.resize((100, 100))
    photo = ImageTk.PhotoImage(img)
    label = tk.Label(root, image=photo)
    label.pack()
except Exception as e:
    print("Error:", e)

root.mainloop()


