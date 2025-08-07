name = input("What's your name? ").title()

while True:
    time_of_day = input("What time of day is it? (morning, afternoon, evening): ").lower().strip()
    if time_of_day in ["morning", "afternoon", "evening"]:
        break
    else:
        print("Please enter a valid time of day (morning, afternoon, evening).")

# Choose a greeting based on time
if time_of_day == "morning":
    greeting = "Good morning, " + name + "! ☀️ Have a bright day ahead!"
elif time_of_day == "afternoon":
    greeting = "Good afternoon, " + name + "! 🌤️ Hope your day is going well!"
elif time_of_day == "evening":
    greeting = "Good evening, " + name + "! 🌙 Relax and enjoy your night!"
else:
    greeting = "Hello, " + name + "! 😊 I hope you're having a good time!"

print(greeting)
print('-' * 30)


name = input("What is your name?")
name = name.title()
time_of_day = input("What time of day is it (morning/afternoon/evening)? ")
print(f"Good {time_of_day}, {name}!")
print('-' * 30)


name = input("What is your name? ").title().strip()
time_of_day = input("What time of day is it (morning/afternoon/evening)? ").strip().lower()

if time_of_day == "morning":
    greeting = "Good morning, " + name + "! ☀️ Have a bright day ahead!"
elif time_of_day == "afternoon":
    greeting = "Good afternoon, " + name + "! 🌤️ Hope your day is going well!"
elif time_of_day == "evening":
    greeting = "Good evening, " + name + "! 🌙 Relax and enjoy your night!"
else:
    greeting = "Hello, " + name + "! 😊 I hope you're having a good time!"

print(greeting)