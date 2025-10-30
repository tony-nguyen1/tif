# tif
Webapp to track my progress at the gym, weight, sleep and eating habits

# Stack
Built with SvelteKit and Turso

# Features
- [x] Authentication
    - [ ] Switch to JWT
- [x] User Profile
    - [ ] Inside a training session
        - [X] Update individual set
        - [x] Delete individual set
        - [X] Display total volume per exercise of this session
        - [X] Find a way to display/hide forms. Button to switch into edit mode. Or, another page to go into: [slug]/editMode
        - [ ] Change schema to workout. Add an association table between workout, exercise and sets. Add remarks for each entry to be able to comment on a group of sets
        - [ ] Simple tag system, multiple tag authorized. Tag are on workouts, not on exercises.
        - [ ] Pre-select last rep and weight based on the last entry of this exercise ?
        Smart enough to count how many sets did in this workout and select the same exercise, last time done and the first, second, third ... sets.
    - [ ] Inside my exercises
        - [X] List of all my exercise
        - [x] Bar chart for the volume per session for each exercise 
- [ ] Weight tracker
    - [ ] Add a data point
    - [ ] Line chart with prediction
- [ ] Sleep tracker (calendar) like a bullet journal + see the repartition of long period of sleep, medium, short ...
- [ ] Meal tracker, log entry, date and time, description, fullness, protein estimation
text + protein counter

https://developer.mozilla.org/en-US/docs/Glossary/Semantics


TODO: Form validation everywhere. Error handling. Stronger typing

Tips & tricks for type inference of nested queries
https://github.com/drizzle-team/drizzle-orm/issues/695