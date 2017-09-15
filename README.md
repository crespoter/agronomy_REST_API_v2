AGRONOMY - ITS PROJECT
REST API for recieving farmer details
list of services:
*villages list      /villagelist
	
*village name lookup with id        /villagelookup/:villageid
	Returns a json with the following elements:
    	success  < -  true if lookup is successfull false if it failed
    	village_name <-  village name of id lookup .... Only available if lookup is successfull

		####   PROFIT/LOSS ####


*average profit of all villages     /profit/all
	return json with the following elements:
    	success: true if person id found false if failed
   	 rest of the json will only be available if success is true
    	profts: an array of json objects containing followin info:
        	date : date the profit was recorded in the format mm-yyyy
        	profit : profit gained during this period
	


*profit of a single village         /profit/village/:villageid
	return json with the following elements:
    	success: true if village id found false if failed
    	rest of the json will only be available if success is true
    	profts: an array of json objects containing followin info:
        	date : date the profit was recorded in the format mm-yyyy
        	profit : profit gained during this period


*profit of a particular person      /profit/person/:personid
	return json with the following elements:
    	success: true if person id found false if failed
    	rest of the json will only be available if success is true
    	profts: an array of json objects containing followin info:
        	date : date the profit was recorded in the format mm-yyyy
        	profit : profit gained during this period



		#### 	CROP CULTIVATED ####

*Crop cultivated average 	/cropcultivated/all
	return json with the following elements:
    	crops: an array of json objects containing followin info:
       	 	date : date the profit was recorded in the format mm-yyyy
        	crop_cultivated : crop cultivated in that period
        	area : area that crop was cultivated

*Crop cultivated by a particular village	/cropcultivated/village/:villageid
	return json with the following elements:
    	crops: an array of json objects containing followin info:
        	villageid : village id
        	date : date the profit was recorded in the format mm-yyyy
        	crop_cultivated : crop cultivated in that period
        	area : area that crop was cultivated

*Crop cultivated by a particular person		/cropcultivated/person/:username
	return json with the following elements:
    	crops: an array of json objects containing followin info:
        	username: username
        	date : date the profit was recorded in the format mm-yyyy
        	crop_cultivated : crop cultivated in that period
        	area : area that crop was cultivated


		####   		PEST 		#####

*Average loss by pests		/pests/all
	return json with the following elements:
    	pests: an array of json objects containing followin info:
        	date : date the pest was recorded in the format mm-yyyy
        	pest_name : pest name
        	loss : loss made by that pest

*Average loss by pests in a particular village 		/pests/village/:villageid
	return json with the following elements:
    	pests: an array of json objects containing followin info:
        	villageid : village id
       	 	date : date the profit was recorded in the format mm-yyyy
        	pest_name : pest name
        	loss : loss made by that pest in INR

*Loss by pests for a particular user 		/pests/person/:username
	  return json with the following elements:
   	 pests: an array of json objects containing following info:
        	username: username
        	date : date the loss was recorded in the format mm-yyyy
        	pest_name : pest name
        	loss : loss made by that pest in INR



		#####	LAND DISTRIBUTION	#####

*Average land distribution 		/land/all
	return json with the following elements:
    	lands: an array of json objects containing followin info:
       		date : date the land distribution was recorded in the format mm-yyyy
        	land_type : land type
        	area : area of that type

Average land distribution in a village 		/land/village/:villageid
	return json with the following elements:
    	land: an array of json objects containing followin info:
        	villageid : village id
        	date : date the land distribution was recorded in the format mm-yyyy
        	land_type : pest name
        	area : area of that type

*Land Distribution of a particular user 	/land/person/:username
	return json with the following elements:
    	land: an array of json objects containing following info:
        	username: username
        	date : date the loss was recorded in the format mm-yyyy
        	land_type : pest name
        	area : area of that type



		####### EXAMPLE BASED ON API HOSTED ON HEROKU ##############

*https://sleepy-sands-75184.herokuapp.com/villagelist

*https://sleepy-sands-75184.herokuapp.com/villageidlookup/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/profit/village/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/profit/person/crespoter

*https://sleepy-sands-75184.herokuapp.com/profit/all

*https://sleepy-sands-75184.herokuapp.com/cropcultivated/village/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/cropcultivated/cropcultivated/all

*https://sleepy-sands-75184.herokuapp.com/cropcultivated/village/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/cropcultivated/person/crespoter

*https://sleepy-sands-75184.herokuapp.com/pests/all

*https://sleepy-sands-75184.herokuapp.com/pests/village/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/pests/person/crespoter

*https://sleepy-sands-75184.herokuapp.com/land/all

*https://sleepy-sands-75184.herokuapp.com/land/village/599db538f36d28631711108e

*https://sleepy-sands-75184.herokuapp.com/land/person/crespoter
