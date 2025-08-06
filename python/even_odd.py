num = int(input("Enter a number: ")) 
# 'num' stores the input number as an integer 'int' from the user by using the input function.
if num % 2 == 0:
    print("The number is even.")
# this code checks if the number 'num' is even by using the modulus operator '%'. An even number has a remainder of 0 when divided by 2. And if the condition is true, it prints that the number is even.
else:
    print("The number is odd.")
# this code checks if the number 'num' is odd by using the modulus operator '%'. An odd number has a remainder of 1 when divided by 2. And if the condition is true, it prints that the number is odd.