Develop a new football app using Next.js for the frontend and Supabase for database management, authentication, and all data storage. The app should have a mobile-first design that looks and feels like a mobile app, even on desktop screens, with a centered layout and mobile footer menu.

Core Features:

User Authentication:

Implement Google Login for user authentication.
Store user authentication details and related data in Supabase.
Homepage:

Display a list of available matches in a modern and visually appealing way.
Each match card should include:
Match date and time.
Venue/location.
Host details.
List of players who have joined.
Provide buttons to:
Join a match (if not already joined).
Cancel participation (if already joined).
Footer Menu:

Use a mobile-friendly footer navigation bar with a + button in the center to create a new match.
Create Match Flow:

Clicking the + button should open a form to create a new game, where users can:
Select a venue from a predefined dropdown list.
Set the date and time of the match.
Specify the number of players required.
Set the cost per player.
Choose whether the match is public or private.
Profile Page:

Allow users to edit their name, surname, profile picture, and skill level.
Include fields for adding social links (e.g., Telegram, Instagram).
Game History:

Add a section for hosts to view a history of hosted and played matches.
Label completed matches as Finished.
Post-Match Features:

After a match finishes, allow users to:
Rate the quality of the match.
Vote for the MVP of the game.
Rate other players anonymously on a scale of 1 to 10.
User Ratings:

Calculate and display the following for each user:
Own Rating: Based on their personal performance and votes.
Community Rating: Aggregated rating from the community.
Styling Requirements:

Use a modern, minimalistic, and beautiful design.
Ensure the UI/UX is clean, easy to understand, and intuitive.
Optimize for mobile-first but ensure a great experience on all devices.
Final Note:
Focus on delivering a cohesive and seamless user experience that prioritizes usability and visual appeal. Save all data securely in the Supabase database, ensuring scalability and reliability.

When user creates a private match we will show him a random 6 digit code to send the other players to join the match. When someone created or join a match we will send them a confirmaiton email with the match details.