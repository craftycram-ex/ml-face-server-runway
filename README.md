# face-server

Our idea to integrate machine learning into the smart home.

Our concept:
![TheCheckIN](https://user-images.githubusercontent.com/57222054/117571313-558d3080-b0ce-11eb-8e4e-8b9a0bbe1eb0.png)

How it works:

https://user-images.githubusercontent.com/57222054/117585737-403af500-b114-11eb-8171-51335cc57df4.mp4


Additional a warning system that can be placed all over the house. 
So that even without an app it is recognized if someone unknown is standing in front of the door.
![Unbenanntes_Projekt](https://user-images.githubusercontent.com/57222054/117572593-e4e91280-b0d3-11eb-9e61-6ad781896877.png)

### Setup

1. clone this repo
2. install the required packages using `npm i`
3. flash the arduino code to a esp8266, connect a green led to pin D0 and a red led to D1. make sure the change the values for the wifi credentials and server ip.
4. run two face recognition models in runway, one in identify faces and one in recognise faces mode. change the ports and host in the backend accordingly.
5. start the backend using `npm start`