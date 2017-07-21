/*
** Designed & Developed By Vasken
** Simple CRUD Operations On Google Maps (Client-Side Only)
** 10/07/2017
**/


# Short Description:
____________________

This small application allows the user to add markers and polygons on the map with various options. This application gives the user the ability to Add/Update/Delete/Visible specific marker/polygon.



# Assumptions:
_____________

- First, I read Google maps API's and how to implement markers and polygons on the map.

- I assumed I have a simple map and the user need to add markers/polygons. Then I thought to give the user the ability to add these elements wherever user want by designing a simple interface for that.

- The Problem here was that the user can add multiple markers/polygons, so I thought I need to save them in an array where each element refers to marker/polygon because they will be assigned by reference.

- Finally, I thought that the user would like to move them on the map, that's why I implemented a new interface for that. 


# How To Run The Application:
_____________________________

* Open index.html

* For Markers:

- To add marker, click on "Add Marker" button and fill the required data - 'Label Text' can't be more than 2 characters and it's the letters on the map
- 'Marker Info Text' is the text which appears when you hover over the marker
- Then click on 'Apply' button
- Now click on the map any desired position to add the marker
- To Update/ToggleVisibility/Delete markers, just follow the app instructions on run time


* For Polygons:

- To add polygon, click on "Add Polygon" button and fill the required data
- Then click on 'Apply' button
- Now You can draw the desired polygon on the map
- To Update/ToggleVisibility/Delete polygons, just follow the app instructions on run time
