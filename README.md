## Rootify

Rootify is a numerical methods tool built using React. It allows users to calculate the roots of a function using two different methods: the bisection method and the Newton-Raphson method.

The third method, Secant, is also available but it is hidden by default. To gain access to the Secant method, just click this url: <a href="https://rootify.vercel.app?secant=true">https://rootify.vercel.app?secant=true</a>

Users can enter a mathematical function, specify the method they want to use, and set parameters such as the initial interval and the maximum number of iterations. This website will then generate a table showing the calculated values for each iteration of the selected method, as well as whether or not the error is less than a specified tolerance.

The user can then analyze the table to determine the root of the function to the desired degree of accuracy. Rootify uses the MathJS library to parse and evaluate the user's mathematical function.

## Project Status
Complete

## Project Screen Shots

#### Bisection  

![Bisection Screenshot](https://raw.githubusercontent.com/lonewanderer27/rootify/master/screenshot_bisection.png)

#### Newton  

![Newton Screenshot](https://raw.githubusercontent.com/lonewanderer27/rootify/master/screenshot_newton.png)

#### Secant  

![Newton Screenshot](https://raw.githubusercontent.com/lonewanderer27/rootify/master/screenshot_secant.png)

## Installation and Setup Instructions 

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To Start Server:

`npm run dev`  

To Visit App:

`localhost:5173`  