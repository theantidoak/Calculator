# Calculator

This is the third and final project of the javascript module in the The Odin Project Foundations course, the central source of my web development resources.

The goal for this calculator is to give the user an easy to use calculator with four operators (+, -, /, *) and four 'top functions' (square, squareroot, factorial, fibonacci) with a clear all button, a delete button, bracket buttons, a decimal button, and a negative button.

The code increased in complexity as I wrote and had more ideas of how I wanted it to function. There are a few paths I wanted:

  1. Be able to chain operations without using the equal sign. If a number is before and after an operator, I want the calculator to update. 
  2. Be able to continue the chain after an equal sign, using the final answer as the input for the next operation.
  3. Be able to use the 'top functions' in the chain operations before and after both equal signs and operators. 
  4. Use brackets, and stop the functions until the closing parenthesis. 

The square() function gave me the most trouble since it was different than the squareroot and factorial functions. The square() function needed to wait until numbers were entered on the opposite side of '^' before calculating. 

Because of the difference between calculating:
  
  1. Before the operator
  2. After the operator
  3. Before the equal sign
  4. After the equal sign
  5. Using brackets before and after each
  6. Using top functions before and after each

  finding and debugging took a long time. 

What I learned from this is to make comments early. (I made them at the end this time). Also if I revisit, I may try to contain every button function in its own function instead of having the operate() and equate() functions which seemed to make my operator and top functions cross wires. 