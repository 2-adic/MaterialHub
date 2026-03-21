# MaterialHub

### About:

MaterialHub is an easy-to-use mobile app for searching and exploring various elements, compounds, and more. It supports advanced, multi-criteria filtering with configurable weights so users can prioritize and combine multiple material properties in a single search.

### Info:

MaterialHub is a React Native application built with Expo for iOS and Android.

This project was collaboratively developed by a team of two for a User Experience Design class project. It is published for educational and portfolio purposes only. Do not use this code for academic coursework.

# Features

### Search for Materials:

The search interface provides a streamlined way to discover materials across a database of elements, compounds, and alloys.

* Material Types: A dropdown menu allows users to filter the results by their types, such as Elements, Alloys, or Allotropes. By default, all types are displayed.

* Property Filters: Multiple filters can be applied simultaneously to narrow down results. The search is inclusive, requiring a material to meet every selected criteria to be displayed in the list.

* Filter Ranges: Users can input specific numerical boundaries for material properties to refine their search. The results are filtered to include only the materials that fall within the defined minimum and maximum values.

* Filter Sorting: Materials are ranked based on the values of their selected properties. This order can be toggled to prioritize either higher or lower numerical values in the results.

* Filter Weights: Users can adjust the weights of individual filters; this lets users stress the importance of a specific filter if multiple are in use.

<img height="500" alt="search-process" src="https://github.com/user-attachments/assets/b5e9da56-ff5a-4527-b60c-fade2f97b1b1" />

### Material Details:

The details page organizes complex data points, such as physical properties and thermodynamic constants, into categorized cards for better readability on mobile screens. This structure ensures that extensive substance information remains accessible and easy to navigate without overwhelming the user. Each property is color-coded to indicate its environmental dependencies: red for temperature-dependent, blue for pressure-dependent, and purple for properties affected by both.

<img height="500" alt="material-details" src="https://github.com/user-attachments/assets/90d7099b-e490-43c2-9f41-5266f4dfef49" />

<br></br>
Users can navigate an interactive phase diagram to track state changes across varying pressure and temperature ranges. The chart features transition lines and key data points which the cursor snaps to for precise readings. As users move through the chart, real-time information is displayed below, identifying the current phase, active transition lines, or specific boundary points.
<br></br>
<img height="400" alt="Interactive P-T phase diagram" src="https://github.com/user-attachments/assets/1e7712a2-d65e-4b7f-a35c-7bcb970a8b66" />

### Periodic Table:

Browse an interactive periodic table. Tap an element to view basic properties; tap the arrow to open its full details page.

<img height="500" alt="table-Screen" src="https://github.com/user-attachments/assets/7e9b40a5-7f81-4c56-884e-21e640467f8e" />

### Favorites:

Favorite a material to access it quickly later.

<img height="500" alt="favorite-screen" src="https://github.com/user-attachments/assets/4850a61a-24fb-4b2c-b2bf-202316a3ac80" />

# Development Setup

### Prerequisites:

- [Node.js](https://nodejs.org/) installed on your computer

### Setup Instructions:

1. **Clone the repository:**

   ```
   git clone https://github.com/2-adic/MaterialHub.git
   ```

2. **Download the Expo Go app:**

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

3. **Install dependencies**

   ```
   npm install --prefix app
   ```

4. **Start the development server:**

   ```
   npm start
   ```

5. **Scan the QR code with your phone's camera to open in Expo Go**
