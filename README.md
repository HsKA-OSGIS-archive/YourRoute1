YourRoute

This project was done in winter semester 2016/2017 by the virtual student-company YourRoute Ltd. at the University of Applied Sciences Karlsruhe.

### About:
The aim of this work was to develope a web-application for crisis-routing. This includes on the one hand “normal” routing and on the other hand the definition of no-go areas, which are areas that should be avoided during the routing. That means if a computed route is passing through an area that should be avoided, the route has to be recomputed around that area. No-go areas can be defined by circles or polygons.The Routing itself done by BRouter and Open Route Service (ORS).

### Authors: 
Alberto Rodrigo Martínez (alrodma4@gmail.com)</br>
Benedikt Futterer (fube1013@hs-karlsruhe.de)</br>
Chenfeng Liu (L605900745@gmail.com)</br>
Fabian Finkbeiner (fifa1015@hs-karlsruhe.de)</br>
Lyudmila Gorokhova (lyudmila.gorokhova@gmail.com)</br>

### Software Used:
•	BRouter (routing)</br>
•	OpenRouteService (routing)</br>
•	OpenStreetMap (map data)</br>

### Data and data sources:
For creating an own BRouter backend you need to download and install BRouter. You can do this in two ways. Either by downloading the complete source code from GitHub (https://github.com/abrensch/brouter) and compile it (Java 6 needed!) or downloading the precompiled one (http://brouter.de/brouter/revisions.html). The source code for BRouter frontend can also be found in GitHub (https://github.com/nrenner/brouter-web). Also the routing data have to be downloaded. For further information to this see point installation.
Because the definition of no-go areas in BRouter is only possible by using circles, Open Route Service (http://openrouteservice.readthedocs.io/en/1.0/index.html, http://wiki.openstreetmap.org/wiki/OpenRouteService) is used additionally to enable this also for using polygons. Unfortunately this is only a service of the  University of Heidelberg. It is not possible to run it on your own machine, so you have to send requests to this and getting a response with the route.

### Installation:
1) Download and install BRouter like it is described in the BRouter-web readme-file. All the needed data can be found in these links (Recommend that you need outdated Java 6 for compiling this):

Backend: https://github.com/abrensch/brouter
Frontend: https://github.com/nrenner/brouter-web
Profile: https://github.com/poutnikl/Brouter-profiles

If you do not have a version of Java 6 on your machine, you can also download a pre-compiled version of BRouter-backend here: http://brouter.de/brouter/revisions.html.

How changes in BRouter can be done, please check in the BRouter documentation.

2) Download routing data from: http://brouter.de/brouter/segments4/

3) Download source-code of the website.

4) Change source (src) of iframeBrouter in result.html to the path of index.html of BRouter-web

### Run:
1) Run BRouter like is described in BRouter-web documentation
start a BRouter server in the standalone directory: 
./server.sh (Linux) or server.cmd (Windows) 
serve the BRouter-directory in the brouter directory: 
python -m SimpleHTTPServer

2) Open one of the webpages (e.g. “home.html”)

### Functionalities:
- Map window: Which contains two map windows, one for BRouter and the other one for OpenRouteService.
-	Definition of no-go areas by drawing circles or polygons
  o	use BRouter to define no-go areas by circles
  o	OpenRouteService to define no-go areas by polygons 
- Show the current position of the client
- Different alternative routes
- Different profiles (car, bicycle, walking, …)
- Show elevation along the route (BRouter)
- Export of route
- Different map layers

### License information:
BRouter uses the "GNU General Public License". This license is a free, copy left license for software and other kinds of works. In this case the "GPL v3" license is used. Everyone is permitted to copy and distribute verbatim copies of this license document, but changing is not allowed. The license is intented to guarantee the freedom of the user to share and change all versions of a program, just to make sure it remains free software for all of its users. The "General Public Licenses" are designed to make sure that the appropriate person has the freedom to distribute copies of free software. So all things considered the user is able to receive source code and is able to change the software. Also the use of it in new free programs is allowed.
