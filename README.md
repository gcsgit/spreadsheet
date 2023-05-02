# Spreadsheet.js
A (very) simple spreadsheet to be used for coding interviews.

## Design Decisions
I started out figuring I would be making a simple React app, and envisioned components like <Row> and <Cell> and such, and thought about what the state and props would look like.

And then I just couldn't bring myself to do it for such a simple app.

React is really wasted overhead here. All we are doing is updating text input values. Our DOM is pretty static. Our biggest reflow is when you focus on a cell and we pop it out larger.

The only real state to be concerned with is which cells have formulas, and again, since we are only updating form input values, we don't need or want React trying to compare its DOMs every time and going through its render process.

So whereas I spun this up quickly as a React app via CRA, and while React of course still gives us nice things like JSX, this spreadsheet once rendered doesn't actually make much use of React. If I had compononetized this further, I could have made use of refs and hooks and such, but its simpler and faster without triggering all the React internals.

In the interest of time I left all the crap that came along with CRA in the repo (forgive me pls), but **everything is in [Spreadsheet.js](https://github.com/gcsgit/spreadsheet/blob/master/src/Spreadsheet.js)**, which is only ~100 lines of code. I put the minimal CSS in App.css.

I stuck pretty closely to the requirements, but I added some cheap keyboard nav, and some validation + styling, both mostly just for my own sanity. I also made the choice that if a cell is referenced in a formula but its value is invalid, then it is just ignored (ie: When the value of cell A2 is invalid, a formula like =A1+A2 calculates as just =A1).

## Where would I take this next
### Edge Cases
I'm sure I didn't get them all. I don't think cyclic is solved right. Figure out exactly how we want to handle input validation and such. Also, if this was gonna be getting more complex, I'd get some tests started to help us not regress as we add functionality.
### Framework
I'd figure out if I needed React. That would be based on product requirements and roadmap. But for a spreadsheet app that needs to perform competitively with its rivals, I might bespoke the JS, and ditch the React. If the product was going to have tons of screens and multi-step modals and such, then React is def worth it.
### Typing
If we were gonna take this much further, I'd want to add typing via Typescript or Flow. Typing slows you down on small apps and speeds you up on big ones.
### Features
The two most interesting next features to me are adding a variable number of rows/cols, and adding more powerful formulae.
- The first one seems pretty simple, but it would force us to be optimized as hell to handle the potential scale. I already setup my code with varying rows/cols in mind.
- The more powerful formulae would be interesting. I see 'Formula' becoming its own massive module that only cares about parsing the formulas and handling their different operands. I could see building this the old fashioned way with RegExes and tons of switches and conditional logic, or maybe trying to find some out-of-the-box NLP/AI tools.

## How to run this dog
Well, its a Create React App, so its the usual deal to spin it up locally:
- Ensure you have all the pre-reqs installed (aka Node)
- Clone the repo down to your local
- cd spreadsheet && npm i && npm start
