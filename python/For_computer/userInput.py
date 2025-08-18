# 2. User Input
print("2. User Input")
# input() gets user input as a string.
user_name = input("Enter your name: ")
user_name = user_name.title() 
# .capitalize() would only capitalize the first letter of the whole string
# .title() capitalizes the first letter of each word
user_age = input("Enter your age: ")
print(f"Hello, {user_name}! You are {user_age} years old.")
print("-" * 40)