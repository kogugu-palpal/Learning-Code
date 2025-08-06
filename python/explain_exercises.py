# Day 2 Python Learning Exercises

# 1. Variables and Data Types
print("1. Variables and Data Types")
age = 25           # integer
height = 1.75      # float
name = "Alice"     # string
is_student = True  # boolean
# Variable store different types of data
print("age:", age, "| type:", type(age))
print("height:", height, "| type:", type(height))
print("name:", name, "| type:", type(name))
print("is_student:", is_student, "| type:", type(is_student))
print("-" * 40) # The code prints a line of 40 dashes: -- which is used to separate sections visually.
# type() function tells what type of data a variable holds
# Note: In Python, you don't need to declare variable types explicitly.
# You can assign any type of value to a variable, and it can change later.


# 2. User Input
print("2. User Input")
# input() gets user input as a string.
user_name = input("Enter your name: ")
user_name = user_name.title() 
# .capitalize() would only capitalize the first letter of the whole string
# .title() capitalizes the first letter of each word
user_age = input("Enter your age: ")
print(f"Hello, {user_name}! You are {user_age} years old.")
# The f-string (formatted string) allows you to embed expressions inside string literals, using curly braces {}.
print("-" * 40)

# 3. If-Else Conditions
print("3. If-Else Conditions")
number = int(input("Enter a number: "))  # convert input to integer
if number % 2 == 0:
    print("Even number")
else:
    print("Odd number")
print("-" * 40)

# 4. Simple Calculator
print("4. Simple Calculator")
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))
operator = input("Enter operator (+, -, *, /): ")

if operator == "+":
    print("Result:", num1 + num2)
elif operator == "-":
    print("Result:", num1 - num2)
elif operator == "*":
    print("Result:", num1 * num2)
elif operator == "/":
    if num2 != 0:
        print("Result:", num1 / num2)
    else:
        print("Error: Cannot divide by zero!")
else:
    print("Invalid operator")
print("-" * 40)

# 5. Loops
print("5. For Loop: Numbers 1 to 10")
for i in range(1, 11):  # starts at 1, ends before 11
    print(i, end=" ")
print("\n" + "-" * 40)

print("5. While Loop: Even numbers from 2 to 20")
i = 2
while i <= 20:
    print(i, end=" ")
    i += 2    # same as i = i + 2
print("\n" + "-" * 40)

# 6. Guess the Number Game
print("6. Guess the Number Game")
import random
secret = random.randint(1, 10)  # pick random number

while True:
    guess = int(input("Guess the number (1-10): "))
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
    else:
        print("Correct!")
        break  # exits the loop

print("Game over. Thanks for playing!")