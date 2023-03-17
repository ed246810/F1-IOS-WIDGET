// VERSION 2.0.3
// 
// NEW UPDATE (2.0.3)
// -BUG FIXES
// 
// NOTE - OFFLINE MODE IS STILL IN DEVELOPMENT
// GET MORE INFO ON - https://github.com/ed246810/F1-IOS-WIDGET
// LEARN MORE ON - https://youtu.be/aBVP9NzzzKU


//MAIN CODE AT LINE ___
//--- 🔖ALL VARRIABLES🔖 ---
//All Varriables delcared here
debugMode=false//for JSON LOG
varLogMode=true//for varriables log
Weathericondark=false //for Weather icon

//FOR SESSION FINISH in MINS
//MUST HAVE "-" MINUS SIGN BEFORE NUMBER
sprintduration= -90
qualiduration= -90
raceduration= -150

//FILE
mainfilename="F1-2023"
officialF1filename="officalF1.json"
raceF1filename="raceF1.json"
weatherfilename="weather.json"
trackimgfilename="trackimg.jpg"
flagfilename="flag.txt"

//⚠️DO NOT EDIT ⚠️

updateversionlink = "https://raw.githubusercontent.com/ed246810/F1-IOS-WIDGET/main/version.json"
scriptlink="https://raw.githubusercontent.com/ed246810/F1-IOS-WIDGET/main/F1%20SCRIPTABLE%20WIDGET.js"

let Dic_weather = {0:["Clear","Clear Sky","01d","01n"],1:["Clear","Mainly Clear","01d","01n"],2:["Cloudy","Partly Cloudy","02d","02n"],3:["Overcast","Overcast","04d","04n"],45:["Fog","Fog","50d","50d"],46:["Fog","Depositing Rime Fog","50d","50d"],51:["Drizzle","Light Drizzle","09d","09d"],53:["Drizzle","Moderate Drizzle","09d","09d"],55:["Drizzle","Dense Drizzle","09d","09d"],56:["Freezing Drizzle","Freezing Light Drizzle","09d"],57:["Freezing Drizzle","Freezing Dense Drizzle","09d"],61:["Rain","Slight Rain","10d","10n"],63:["Rain","Moderate Rain","10d","10n"],65:["Rain","Heavy Rain","09d","09d"],66:["Freezing Rain","Freezing Light Rain","13d","13d"],67:["Freezing Rain","Freezing Heavy Rain","13d","13d"],71:["Snow","Slight Snow Fall","13d","13d"],73:["Snow","Moderate Snow Fall","13d","13d"],75:["Snow","Heavy Snow Fall","13d","13d"],77:["Snow","Snow Grains","13d","13d"],80:["Rain Showers","Slight Rain Showers"],81:["Rain Showers","Moderate Rain Showers","09d","09d"],82:["Rain Showers","Violent Rain Showers","09d","09d"],85:["Snow Showers","Slight Snow Showers","13d","13d"],86:["Snow Showers","Heavy Snow Showers","13d","13d"],95:["Thunderstorm","Thunderstorm","11d","11d"],96:["Thunderstorm","Thunderstorm with slight hail","11d","11d"],99:["Thunderstorm","Thunderstorm with heavy hail","11d","11d"]}

dF= new DateFormatter()

APIofficalF1="https://livetiming.formula1.com/static/"
APIraceF1="https://ergast.com/api/f1/current/"

APItimezone={"Base":"https://www.timeapi.io/api/TimeZone/coordinate?Latitiude=","lon":"&longitude="}
APIweather={"Base":"https://api.open-meteo.com/v1/forecast?latitude=","Lon":"&longitude=","Tz":"&hourly=temperature_2m,precipitation,weathercode&timezone=","End":"&past_days=1"}


APIofficalF1={"Base":APIofficalF1,"SessionInfo":"SessionInfo.json", "RaceControl":"RaceControlMessages.json","TrackStatus":"TrackStatus.json","LapCount":"LapCount.json","DriverList":"DriverList.json","StreamingStatus":"StreamingStatus.json"}

//CHANGE NEXT TO DEFUALT
APIraceF1 ={"Base":APIraceF1,"Next":"next.json",
	"Quali":"next/qualifying.json","PrevRace":"last/results.json","Sprint":"next/sprint.json","WDC":"driverStandings.json","WCC":"constructorStandings.json"}

APIflag = {"Base":'https://restcountries.com/v3.1/name/',"End":'?fields=name,capital,currencies,flag,population,timezones,continents'}

APIweather={"Base":"https://api.open-meteo.com/v1/forecast?latitude=","Lon":"&longitude=","Tz":"&hourly=temperature_2m,precipitation,weathercode&timezone=","End":"&past_days=1"}

DataraceF1=[],DataofficalF1=[],Dataweather=[]
path=[]
path.officalF1="",path.raceF1="",path.weather="",path.trackimg="",path.flag=""

RaceName="",RaceRound="",RaceCountry=""
UserTZ=""

isSprint=""

isRaceFinish="",isSprintFinish="",isQualiFinish=""

wdc=[]
DateTime={Race:"",Quali:"",Sprint:"", FP1:""}

Time={GMT:"",USER:""}
Time.GMT={Race:"",Quali:"",Sprint:"", FP1:""}
Time.USER={Race:"",Quali:"",Sprint:"", FP1:""}

Date.USER={Race:"",Quali:"",Sprint:"", FP1:""}
Date.GMT={Race:"",Quali:"",Sprint:"", FP1:""}

Weather={Race:"",Quali:"",Sprint:"", FP1:""}
Weather.Race={Id:"",Code:"",Info:"",Show:"",mm:"",Temp:"",Error:""}
Weather.Quali={Id:"",Code:"",Info:"",Show:"",mm:"",Temp:"",Error:""}
Weather.Sprint={Id:"",Code:"",Info:"",Show:"",mm:"",Temp:"",Error:""}
Weather.FP1={Id:"",Code:"",Info:"",Show:"",mm:"",Temp:"",Error:""}

Countdown={Days:"",Hours:"",Mins:""}
Countdown.Days={Race:"",Quali:"",Sprint:"", FP1:""}
Countdown.Hours={Race:"",Quali:"",Sprint:"", FP1:""}
Countdown.Mins={Race:"",Quali:"",Sprint:"", FP1:""}

//--- 🔹ALL VARRIANLES FINISH🔹 ---
async function getData(link)
{
	var req = await new Request(link)
	var res = await req.loadJSON() 
	return res
}

function formatdatetime(format,datein)
{
	var dat= new Date(datein)
	dF.dateFormat = format	
	res =dF.string(dat)	
	return res	
}


async function gettimezone(lat,lon)
{
	var Link=APItimezone.Base+lat+APItimezone.lon+lon
	var res = await getData(Link)
	var res = res.timeZone
	return res
}

async function getcountdown(date) //0DAYS,1HOURS,2MINUTES
{
	let d = new Date(date)
	let now = new Date()
	let diffMs = (d - now); // milliseconds
	let diffMins = Math.round(((diffMs/1000)/60)) //Mintues
	let diffHrs = Math.round((diffMins/60))
	let diffDays = Math.round((diffHrs/24))
	return[diffDays,diffHrs,diffMins]
}

function debugLog(msg)
{
	//DISPLAY DEBUG MSG IF SETTINGS IS ON
	if(debugMode == true)
	{
		log(msg)
	}
}

function varLog(msg1)
{
	if(varLogMode==true)
	{
		log(msg1)
	}
}

//MAIN CODE FUNCTIONS ---
async function checkonline()
{
	log("* FUNCTION - checkonline")
	try
	{
				log(APIraceF1.Base+APIraceF1.Next)
		await getData(APIraceF1.Base+APIraceF1.Next)

		isOnline=true
		log("DEVICE IS ONLINE")
	}
	catch(err)
	{
		log(err)
		isOnline=false
		log("DEVICE IS OFFLINE")
	}
}

async function checkupdate(version)
{
	if(!isOnline)
	{
		return
	}
	
	updateinfo = await getData(updateversionlink)
	latestversion = updateinfo.version
	log("lastest version - "+latestversion)	
	
	if(version != latestversion)
	{
		//GET LATEST CODE
		let req = new Request(scriptlink)
		updatedcode = await req.loadString()
		//FIND SCRIPT LOCATION ON DEVICE
		fm = FileManager.iCloud()
		let path = fm.joinPath(fm.documentsDirectory(),`${Script.name()}.js`)
		log(path)
		//UPDATE SCRIPT
		fm.writeString(path,updatedcode)
		log("Update Complete")
	}

}


function getUSERtimezone()
{
	log("* FUNCTION - getUSERtimezone")
	userTZ=Intl.DateTimeFormat().resolvedOptions().timeZone
	var logmsg = "userTZ - "+userTZ
	varLog(logmsg)
}

function setupFileManager()
{
	log("* FUNCTION - setupFileManager")
	//File Manager
	file = FileManager.local()
	dir = file.documentsDirectory()
	path = {"base":file.joinPath(dir,mainfilename)}
	
	//CREATE FILE, FOR NEW SETUP
	if(!file.fileExists(path.base))
	{
		file.createDirectory(path.base,false)	
	}
	
	//JSON FILE
	path.officalF1= path.base+officialF1filename
	path.raceF1= path.base+raceF1filename
	path.weather= path.base+weatherfilename
	path.trackimg=path.base+trackimgfilename
	path.flag=path.base+flagfilename
}

async function getAPIraceF1()
{
	//IF OFFLINE
	if (!isOnline)
	{
		log("NO DATA - DataraceF1")
		DataraceF1=undefined
		return
	}
	
	//IF ONLINE
	try{
	
	//GETTING INFO FRM APIS
	var Data = await Promise.all ([
	getData(APIraceF1.Base+APIraceF1.Next), //0 - NEXT
	getData(APIraceF1.Base+APIraceF1.Quali), //1 - QUALI(NEXT)
	getData(APIraceF1.Base+APIraceF1.PrevRace), //2 - RACE (PREVIOUS)
	getData(APIraceF1.Base+APIraceF1.Sprint), //3 - SPRINT (NEXT)
	getData(APIraceF1.Base+APIraceF1.WDC), //4 - WDC
	getData(APIraceF1.Base+APIraceF1.WCC), //5 - WCC
	])
	debugLog(Data)
	
	//SAVING DATA TO VAR
	DataraceF1= {"Next":Data[0],"Quali":Data[1],"PrevRace":Data[2],"Sprint":Data[3],"WDC":Data[4],"WCC":Data[5],"Updated":Date()}
	debugLog(Data)
	}

	catch(err)
	{
		log(err)
		DataraceF1= undefined
	}
	
}

async function getAPIofficalF1()
{
	log("* FUNCTION - getAPIofficalF1")
	
	if (!isOnline)
	{
		log("NO DATA - DataofficalF1")
		DataofficalF1=undefined
		return
	}
	
	//GET API DATA
	try{
	//GETTING INFO FRM APIS
	var Data = await Promise.all ([
	getData(APIofficalF1.Base+APIofficalF1.SessionInfo), //0
	getData(APIofficalF1.Base+APIofficalF1.RaceControl), //1
	getData(APIofficalF1.Base+APIofficalF1.TrackStatus), //2
	getData(APIofficalF1.Base+APIofficalF1.LapCount), //3
	getData(APIofficalF1.Base+APIofficalF1.DriverList), //4
	getData(APIofficalF1.Base+APIofficalF1.StreamingStatus), //5
	])
	debugLog(Data)
	log(Data)
	
	//SAVING DATA TO VAR
	DataofficalF1= {"SessionInfo":Data[0],"RaceControl":Data[1],"TrackStatus":Data[2],"LapCount":Data[3],"DriverList":Data[4],"StreamingStatus":Data[5],"Updated":Date()}
	
	debugLog(Data)
	
	}

	catch(err)
	{
		log(err)
		DataofficalF1 = undefined
	}
}



async function SaveGetData(vtype,vpath,vdata)
{
	log("* FUNCTION - SaveGetData")
	debugLog(vpath)
	if(vdata!=undefined)
	{//SAVE DATA

		if(vtype="json")
		{
			vstoredata = JSON.stringify(vdata)
		}
		else
		{
			vstoredata=vdata
		}
		file.writeString(vpath,vstoredata)		
		vlocaldata=false
		log("SAVED")
	}
	else
	{
		vdata = await file.readString(vpath)
		vlocaldata=true
		
		if(vtype="json")
		{
		vdata = await JSON.parse(vdata)
		}
		
		log("LOCALDATA USED")
	}
	vdata.localdata=vlocaldata
	
	debugLog(vdata)
	return(vdata)
}

async function getraceinfo()//COUNTRY,LAT,LON,ROUND,RACETZ
{	
	log("* FUNCTION - getraceinfo")
	RaceRound=DataraceF1.Next.MRData.RaceTable.Races[0].round
	RaceName=DataraceF1.Next.MRData.RaceTable.Races[0].raceName
	RaceCountry= DataraceF1.Next.MRData.RaceTable.Races[0].Circuit.Location.country
	RaceLat=DataraceF1.Next.MRData.RaceTable.Races[0].Circuit.Location.lat
	RaceLon=DataraceF1.Next.MRData.RaceTable.Races[0].Circuit.Location.long
	RaceTrack= DataraceF1.Next.MRData.RaceTable.Races[0].Circuit.Location.locality

	//ONLINE PART
	RaceTZ= await gettimezone(RaceLat,RaceLon)

var logmsg = "RaceRound - "+RaceRound+" | RaceName - " +RaceName	+" | RaceCountry - "+RaceCountry+" | RaceLat - "+RaceLat+" | RaceLon - "+RaceLon+" | RaceTZ - "+RaceTZ+" | RaceTrack - "+RaceTrack

varLog(logmsg)
	
}

function checksprintweekend()
{
	log("* FUNCTION - checksprintweekend")
	try
	{
	var data = DataraceF1.Next.MRData.RaceTable.Races[0].Sprint
	}
	catch(err)
	{
		data = undefined
		debugLog(data)
	}
	
	if (data==undefined)
	{
		isSprint=false
	}
	else
	{
		isSprint=true
	}
	var logmsg= "isSprint - "+isSprint
	varLog(logmsg)
}

function getsessiondatetime()
{
	log("* FUNCTION - getsessiondatetime")
	DateTime.Race = new Date(DataraceF1.Next.MRData.RaceTable.Races[0].date+"T"+DataraceF1.Next.MRData.RaceTable.Races[0].time)
	
	DateTime.Quali = new Date(DataraceF1.Next.MRData.RaceTable.Races[0].Qualifying.date+ "T"+DataraceF1.Next.MRData.RaceTable.Races[0].Qualifying.time)
	
	var logmsg = "DateTime | .Race - "+DateTime.Race +" | .Quali - "+DateTime.Quali
	
	if(isSprint)
	{
		DateTime.Sprint = new Date(DataraceF1.Next.MRData.RaceTable.Races[0].Sprint.date+ "T"+DataraceF1.Next.MRData.RaceTable.Races[0].Sprint.time)
		
		logmsg+= " | .Sprint - "+DateTime.Sprint
	}
	
	varLog(logmsg)
}

function getsessiondateUSER()//YYYY-MM-DD
{
	log("* FUNCTION - getsessiondateUSER")
	Date.USER.Race = new Intl.DateTimeFormat('arn-CL').format(DateTime.Race)
	Date.USER.Quali=new Intl.DateTimeFormat('arn-CL').format(DateTime.Quali)
	var logmsg = "Date.USER | .Race - "+Date.USER.Race+" | .Quali - " +Date.USER.Race
	
	if(isSprint)
	{
	Date.USER.Sprint=new Intl.DateTimeFormat('arn-CL').format(DateTime.Sprint)
	logmsg+=" | .Sprint - "+Date.USER.Sprint
	}
	varLog(logmsg)
}

function getsessiondateGMT()//YYYY-MM-DD
{
	log("* FUNCTION - getsessiondateGMT")

	Date.GMT.Race = new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT"}).format(DateTime.Race)
	Date.GMT.Quali = new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT"}).format(DateTime.Quali)
	var logmsg = "Date.GMT | .Race - "+Date.GMT.Race+" | .Quali - "+Date.GMT.Quali
	
	if(isSprint)
	{
		Date.GMT.Sprint= new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT"}).format(DateTime.Sprint)
		logmsg+=" | .Sprint "+Date.GMT.Sprint
	}
	
	varLog(logmsg)
	
}

function getsessiontimeUSER()
{
	log("* FUNCTION - getsessiontimeUSER")
	Time.USER.Race = new Intl.DateTimeFormat('arn-CL',{hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Race)
	Time.USER.Quali = new Intl.DateTimeFormat('arn-CL',{hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Quali)
	var logmsg = "Time.USER | .Race - "+Time.USER.Race+" | .Quali - "+Time.USER.Quali
	
	if(isSprint)
	{
		Time.USER.Sprint = new Intl.DateTimeFormat('arn-CL',{hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Quali)
	logmsg += " | .Sprint - "+Time.USER.Sprint
	}
	
	varLog(logmsg)
}

function getsessiontimeGMT()
{
	log("* FUNCTION - getsessiontimeGMT")
	
	Time.GMT.Race = new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT",hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Race)
	Time.GMT.Quali = new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT",hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Quali)
	var logmsg = "Time.GMT | .Race - "+Time.GMT.Race+" | .Quali - "+Time.GMT.Quali
	
	if(isSprint)
	{
		Time.GMT.Sprint = new Intl.DateTimeFormat('arn-CL',{timeZone:"GMT",hour12:false,hour:"2-digit",minute:"2-digit"}).format(DateTime.Sprint)
	logmsg += " | .Sprint - "+Time.GMT.Sprint
	}
	
	varLog(logmsg)
}

async function gettrackimg()
{
	log("*FUNCTION - gettrackimg")
	
	if (!isOnline)
	{
		log("NO DATA - trackimg")
		trackimg=undefined
		return
	}
	
	var race=RaceName.replace("Grand Prix","")
	
	for(run=true,i=0;run==true&&i<3;i++)
	{
		try
		{
		var code=race.replaceAll(" ","%20")
		var link = "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/"+code+"carbon.png.transform/8col/image.png"
		trackimg =await new Request(link).loadImage()
		run = false
		varLog("+ Got track img")
		}
		catch(err)
		{
		debugLog(err)
		varLog(" ^ ERROR - Trying to get track img again")
		race=RaceCountry+" "
		}
	}
}

async function SaveGetDataJPG(vpath,vdata)
{
	log("* FUNCTION - SaveGetDataJPG")
	debugLog(vpath)
	if(vdata!=undefined)
	{//SAVE DATA
		file.writeImage(vpath,vdata)
		vlocaldata=false
		log("SAVED")
	}
	else
	{
		vdata = await file.readImage(vpath)
		vlocaldata=true
		log("LOCALDATA USED")
	}
	vdata.localdata=vlocaldata
	
	debugLog(vdata)
	return(vdata)
}


async function getcountryflag(country)
{
	log("* FUNCTION - getcountryflag")
	
	if(!isOnline)
	{
		return undefined
	}
	
	try{
		
		var countrylink = country.replace(" ","%20")
		//API 1
		var link = APIflag.Base+countrylink+APIflag.End
		var res = await getData(link)
		res = res[0].flag
		varLog(res)
		return res
		}
	catch
	{
		return undefined
	}
}


async function getsessioncountdown()
{
	log("FUNCTION - getsessioncountdown")
	//0DAYS,1HOURS,2MINUTES
	var RaceCountdown = await getcountdown(DateTime.Race,)
	var QualiCountdown = await getcountdown(DateTime.Quali)
	var SprintCountdown=""
	
	{
		var SprintCountdown = await getcountdown(DateTime.Sprint)
	}
	Countdown.Days={Race:RaceCountdown[0],Quali:QualiCountdown[0], Sprint:SprintCountdown[0], FP1:""}
	Countdown.Hours={Race:RaceCountdown[1],Quali:QualiCountdown[1], Sprint:SprintCountdown[1], FP1:""}
	Countdown.Mins={Race:RaceCountdown[2],Quali:QualiCountdown[2], Sprint:SprintCountdown[2], FP1:""}
	
	varLog("Countdown.Days")
	varLog(Countdown.Days)
	
	varLog("Countdown.Hours")
	varLog(Countdown.Hours)
	
	varLog("Countdown.Mins")
	varLog(Countdown.Mins)
}

function checksessionfinish()
{
	log("* FUNCTION - checksessionfinish")
	isQualifinish=false,isRacefinish=false,isSprintfinish=false
	if(qualiduration>Countdown.Mins.Quali)
	{
		isQualifinish=true
	}
	if(raceduration>Countdown.Mins.Race)
	{
		isRacefinish=true
	}
	if(isSprint&&sprintduration>Countdown.Mins.Sprint)
	{
		isSprintfinish=true
	}
	var logmsg="isQualifinish - "+isQualifinish+" | isRacefinish - "+isRacefinish +" | isQualifinish - "+ isSprintfinish
	varLog(logmsg)
}

async function getweatherdata()
{
	log("* FUNCTION - getweatherinfo")
	if(!isOnline)
	{
		Dataweather = undefined
		return
	}
	
	var link = APIweather.Base+RaceLat+APIweather.Lon+RaceLon+APIweather.Tz+userTZ+APIweather.End
	Dataweather = await getData(link)
	debugLog(Dataweather)
}


async function getweatherid(date,msg)//TEMP,MM,CODE
{
	log("* FUNCTION - getweatherinfo - "+msg)
	//RE-FORMAT DATES for API
	var YYMMDD = formatdatetime ("YYYY-MM-dd",date)
	var HH = formatdatetime ("HH",date)
	var DT = YYMMDD+"T"+HH+":00"
	
	var logmsg = "YYMMDD - "+YYMMDD+" | HH - "+HH+" | DT - "+DT
	varLog(logmsg)
	
	//GETTING "I" / WEATHER ID
	for(i=0,fw=0;fw!=DT && fw!=undefined;i++)
	{
		werror = false	
		fw=Dataweather.hourly.time[i]
	}
	
	if(fw==undefined)
	{
		i=i-1 //PREVIOUS
		Weather[msg].Error=true
		varLog("Weather."+msg+".Error - TRUE")
	}
	
	i=i-1 //OFFSET
	weatherid=i
	varLog("Weather."+msg+".Id - "+weatherid)	
	return weatherid
}

async function getweatherinfo(weatherid,type)//CODE,TEMP,MM,ICON
{
	log("* FUNCTION - getweatherinfo - "+type)
	
	Weather[type].Code = Dataweather.hourly.precipitation[weatherid]
	Weather[type].Temp = Dataweather.hourly.temperature_2m[weatherid]
	Weather[type].mm = Dataweather.hourly.weathercode[weatherid]

	var logmsg = "Weather."+type+" |.Temp - "+Weather[type].Temp+" |.mm - "+Weather[type].mm
	varLog(logmsg)
	
	//.INFO
	var codeinfo = Dic_weather[Weather[type].Code]
	Weather[type].Info =codeinfo[1]


	//DARK-LIGHT MODE CODE
	if (Weathericondark==true)
		{
			Weather[type].Code=codeinfo[3]	
		}
	else if (Weathericondark == false)
		{
			Weather[type].Code=codeinfo[2]	
		}
	
	//SHOW - MM or TEMP
	if((Weather[type].mm==0)||(Weather[type].Info != "Drizzle")||(Weather[type].Info!="Rain"))
		{
		Weather[type].Show = Weather[type].Temp+" °C"
		}
	else 
	{
		Weather[type].Show = Weather[type].mm+" mm"
	}
	
	logmsg="Weather."+type+" |.Show - "+Weather[type].Show+" |.Info - "+Weather[type].Info+" |.Code - "+Weather[type].Code
	varLog(logmsg)
	
	
		//ICON
	var res = await new Request("http://openweathermap.org/img/wn/"+Weather[type].Code+"@2x.png").loadImage()
	Weather[type].Icon = res
	
}

function getweathericon()
{
	//x={0:Race,1:Quali,2:Sprint}
	//isWeather=[],isFinish=[]
//	var isWeather={Race:isRaceWeather,Quali:isQualiWeather,Sprint:isSprintWeather}
	//var isFinish = {Race:isRaceFinish,Quali:isQualiFinish,Sprint:isSprintFinish}
	
	//OFFLINE MODE STILL IN WORKING
}

function getwdc()
{
	for(p=1,i=0;i<20;p++,i++)
	{
	wdc[p]=DataraceF1.PrevRace.MRData.RaceTable.Races[0].Results[i].Driver.familyName
	}
	
	logmsg="WDC - "+wdc
	varLog(logmsg)
}



//--MAIN CODE--//
//for(runmaincode=true,runtime=1;runmaincode==true&&runtime<3;runtime++)
//{
//try
//{
//log("^^ RUN - "+runtime)
await checkonline()
await checkupdate("2.0.3")

getUSERtimezone()
setupFileManager()

await getAPIraceF1()//DataraceF1
DataraceF1 = await SaveGetData("json",path.raceF1,DataraceF1)
//await getAPIofficalF1()//DataofficalF1
//DataofficalF1 = await SaveGetData("json",path.officalF1,DataofficalF1)
//ERROR WITH F1 API COULD BE CASUE BY NEW SEASON - F1 SERVERS



//SESSION INFO - RACE QUALI SPRINT
getraceinfo()//COUNTRY,LAT,LON,ROUND,RACETZ
checksprintweekend()//isSprint-T/F
getsessiondatetime()//DT
getsessiondateUSER()//YYYY-MM-DD
getsessiondateGMT()//YYYY-MM-DD
getsessiontimeUSER()//HH:MM
getsessiontimeGMT()//HH:MM
await gettrackimg()//trackimgss[]
trackimg = await SaveGetDataJPG(path.trackimg,trackimg)
countryflag = await getcountryflag(RaceCountry)
countryflag=await SaveGetData("",path.flag,countryflag)
log("PPP")
await getsessioncountdown()
checksessionfinish()



//WEATHER INFO
await getweatherdata()
Dataweather = await SaveGetData("json",path.weather,Dataweather)
isRaceWeather=true,isQualiWeather=true,isSprintWeather=true
	//RACE
if(Countdown.Days.Race<6&&Countdown.Days.Race>-1)//< PLUS IS RACE
{
	Weather.Race.Id = await getweatherid(DateTime.Race,"Race")
	await getweatherinfo(Weather.Race.Id,"Race")
	isRaceWeather=true
}
	//QUALI
if(!isQualifinish&&Countdown.Days.Quali<6) 
{
	Weather.Quali.Id = await getweatherid(DateTime.Quali,"Quali")
	await getweatherinfo(Weather.Quali.Id,"Quali")
	isQualiWeather=true
}
	//SPRINT
if(isSprint&&!isSprintfinish&&Countdown.Days.Sprint<6)
{
	Weather.Sprint.Id = await getweatherid(DateTime.Sprint,"Sprint")
	await getweatherinfo(Weather.Sprint.Id,"Sprint")
	isSprintWeather=true
}

getweathericon()



//WDC
getwdc()
//WCC
	//NOT NOW
//-- WIDGET --
await createwidget()
await mainwidstacks()

leftwidstack()
leftwidtitle()
await leftwidbox()

rightwidstack()
await rightwidtop10()





showwidget()

//leftwidget

//runmaincode=false
//log("!!! RUNTIME - "+runtime+" | runmaincode - "+runmaincode)
//}
//catch(err)
//{
	//log("^^^ MAIN CODE - ERROR FOUND")
	//log("RUNTIME - "+runtime)
	//runmaincode=true
	//logError(err)
	//}
//}
// -- END OF MAIN CODE--//



// ---- WIDGET FUNCTIONS ----
function createwidget()
{
	wid = new ListWidget()
	wid.backgroundColor= Color.black()
}

function mainwidstacks()
{
	wid.All=wid.addStack()
		wid.All.size = new Size(342,155)
		wid.All.layoutHorizontally()

	wid.Left= wid.All.addStack()
		wid.Left.size = new Size(171,155)
		wid.Left.layoutVertically()
	
	wid.Right= wid.All.addStack()
		wid.Right.size = new Size(171,155)
}

function leftwidstack()
{
	//STACK TITLE
	wid.Left.Title = wid.Left.addStack()
		wid.Left.Title.size = new Size(171,20)
		wid.Left.Title.setPadding(2, 2, 2,2)
		wid.Left.Title.layoutHorizontally()
		wid.Left.Title.centerAlignContent()

	wid.Left.addSpacer(5)

	//STACK-BOX
	wid.Left.Box=wid.Left.addStack()
		wid.Left.Box.size = new Size(171,122)
		wid.Left.Box.centerAlignContent()
		wid.Left.Box.addSpacer(8)
}

function leftwidtitle()
{
	//LIVE REC
	//to set diff color for future versions	
	wid.Left.Title.LiveRec=wid.Left.Title.addStack()
		wid.Left.Title.LiveRec.size = new Size(17,17)
		wid.Left.Title.LiveRec.cornerRadius =2
		wid.Left.Title.LiveRec.backgroundColor= Color.blue()

	wid.Left.Title.addSpacer(8)

	//VAR TRACK/CIRCUIT TXT
	wid.Left.Title.Circuit_txt = wid.Left.Title.addText(RaceTrack)
		wid.Left.Title.Circuit_txt.minimumScaleFactor=0.01
		wid.Left.Title.Circuit_txt.font = Font.boldMonospacedSystemFont(15)

	wid.Left.Title.addSpacer(5)

	//VAR FLAG TXT
	wid.Left.Title.Flag = wid.Left.Title.addText(countryflag)
		wid.Left.Title.Flag.font = Font.boldSystemFont(18);
		wid.Left.Title.Flag.textColor = Color.white();
}

async function leftwidbox()
{
	if(Countdown.Days.Quali==1000)
	{
		//TO BE DEVELOPED LATER
		await leftwidcountdownstacks()
		await leftwidcountdownele()
	}
	else if (isSprint&&!isSprintfinish||!isSprint&&!isQualifinish)
	{
		await leftwid2sessionstacks()
		await leftwid2sessionele()
	}
	else if(isSprint&&isSprintfinish||!isSprint&&isQualifinish)
	{
		await leftwidracestacks()
		await leftwidraceele()
	}
}

//STACKS - LEFTWIDBOX
function leftwidcountdownstacks()
{
	log("WIDGET - COUNTDOWN")
	//COUNT	
	wid.Left.Box.Countdown= wid.Left.Box.addStack()
		wid.Left.Box.Countdown.size= new Size(156,120)
		wid.Left.Box.Countdown.layoutVertically()
		wid.Left.Box.Countdown.cornerRadius = 8
	
	//TRACK
	wid.Left.Box.Countdown.Track = wid.Left.Box.Countdown.addStack()
		wid.Left.Box.Countdown.Track.size = new Size(156,70)
		wid.Left.Box.Countdown.Track.layoutHorizontally()
		wid.Left.Box.Countdown.Track.backgroundColor= new Color("#c3c3c3")
	//COUNT
	wid.Left.Box.Countdown.Count=wid.Left.Box.Countdown.addStack()
		wid.Left.Box.Countdown.Count.size = new Size(156,50)
		wid.Left.Box.Countdown.Count.layoutHorizontally()
		wid.Left.Box.Countdown.Count.backgroundColor= new Color("#b4b4b4")
}

function leftwid2sessionstacks()
{
	//QUALI RACE BOX

	log("WIDGET - QUALI&RACE BOX")
//*LEFT BOX*(WL)
	//LEFT QUALI RACE(BOX) --- STACK
	wid.Left.Box.QR= wid.Left.Box.addStack()
		wid.Left.Box.QR.size= new Size(156,120)
		wid.Left.Box.QR.cornerRadius = 8
		wid.Left.Box.QR.layoutHorizontally()

//*LEFT-QR A/B(BOX)*(WLQR)
	//BOX A (QUALI MINI BOX)
	wid.Left.Box.QR[0]=wid.Left.Box.QR.addStack()
		wid.Left.Box.QR[0].size= new Size(78,120)
		wid.Left.Box.QR[0].layoutVertically()
		wid.Left.Box.QR[0].backgroundColor= new Color("#c3c3c3")
	//BOX B (RACE MINI BOX)
	wid.Left.Box.QR[1]=wid.Left.Box.QR.addStack()
		wid.Left.Box.QR[1].size= new Size(78,120)
		wid.Left.Box.QR[1].layoutVertically()
		wid.Left.Box.QR[1].backgroundColor= new Color("#b4b4b4")
		
//*LEFT QR BOX A/B
	
	for (i=0;i<2;i++)
	{
	wid.Left.Box.QR[i].addSpacer(3)
	
	//TITLE --- STACK
	wid.Left.Box.QR[i].Title = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Title.size= new Size(78,15)
		wid.Left.Box.QR[i].Title.layoutHorizontally()
		
	//TIME --- STACK
	wid.Left.Box.QR[i].Time = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Time.size= new Size(78,22)
		wid.Left.Box.QR[i].Time.layoutHorizontally()
	
	//CONTENT --- STACK
	wid.Left.Box.QR[i].Cont = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Cont.size= new Size(78,80)
		wid.Left.Box.QR[i].Cont.layoutVertically()
		wid.Left.Box.QR[i].Cont.topAlignContent()
		}

}

function leftwidracestacks()
{
	//RACE BOX
	log("WIDGET - RACE BOX")
	//RACE BOX --- STACK
	wid.Left.Box.Race= wid.Left.Box.addStack()
		wid.Left.Box.Race.size= new Size(156,120)
		wid.Left.Box.Race.cornerRadius = 8
		wid.Left.Box.Race.layoutVertically()

	
	//RINFO --- STACK
	wid.Left.Box.Race.Info = wid.Left.Box.Race.addStack()
		wid.Left.Box.Race.Info.size = new Size(156,25)
		wid.Left.Box.Race.Info.bottomAlignContent()
		wid.Left.Box.Race.Info.backgroundColor= new Color("#c3c3c3")
	
	//RWEATHER --- STACK
	wid.Left.Box.Race.Weather = wid.Left.Box.Race.addStack()
	wid.Left.Box.Race.Weather.size = new Size(156,40)
	wid.Left.Box.Race.Weather.centerAlignContent()
	wid.Left.Box.Race.Weather.backgroundColor= new Color("#c3c3c3")
	
	//RFAST --- STACK
	wid.Left.Box.Race.Fast = wid.Left.Box.Race.addStack()
	wid.Left.Box.Race.Fast.size = new Size(156,55)
		wid.Left.Box.Race.Fast.layoutHorizontally()
		wid.Left.Box.Race.Fast.backgroundColor=new Color("#b4b4b4")
}


//ELEMENTS - LEFTWIDBOX
function leftwidcountdownele()
{
	//FUTURE VERSIONS
}

function leftwid2sessionele()
{
	wid.V=[],wid.V.Title=[],wid.V.Time=[],wid.V.Weather=[], wid.V.Countdown=[],wid.V.Days=[],wid.V.TrackImg=[]
	wid.V.Weather.img=[] ,wid.V.Weather.info=[]
			wid.V.Weather.addinfo=[] 
			
	//TITLE - TIME
	if(isSprint&&!isQualifinish)
	{
		wid.V.Title[0] = "Quali", wid.V.Time[0] = Time.USER.Quali
		wid.V.Title[1] = "Sprint", wid.V.Time[1] = Time.USER.Sprint	
	}
	else if (isSprint&&isQualifinish)
	{
		wid.V.Title[0] = "Sprint", wid.V.Time[0] = Time.USER.Sprint
		wid.V.Title[1] = "Race", wid.V.Time[1] = Time.USER.Race	
	}
	else if (!isSprint&&!isQualifinish)
	{
		//QUALI-RACE
		wid.V.Title[0] = "Quali", wid.V.Time[0] = Time.USER.Quali
		wid.V.Title[1] = "Race", wid.V.Time[1] = Time.USER.Race	
	}
	
	//WEATHER - COUNTDOWN - BOX A
		if (Weather[wid.V.Title[0]].Id != "")
		{
			wid.V.Weather[0]=true
			wid.V.Weather.img[0] = Weather[wid.V.Title[0]].Icon
			wid.V.Weather.info[0] = Weather[wid.V.Title[0]].Info
			wid.V.Weather.addinfo[0] = Weather[wid.V.Title[0]].Show
		}
		else
		{
			wid.V.Weather[0]=false
			wid.V.Countdown[0]=true
			wid.V.Days[0] = Countdown.Days[wid.V.Title[0]]
		}
		
		//WEATHER - TRACKIMG - BOX B
		if (Weather[wid.V.Title[1]].Id != "")
		{
			wid.V.Weather[1]=true
			wid.V.Weather.img[1] = Weather[wid.V.Title[1]].Icon
			wid.V.Weather.info[1] = Weather[wid.V.Title[1]].Info
			wid.V.Weather.addinfo[1] = Weather[wid.V.Title[1]].Show
		}
		else
		{
			wid.V.Weather[1]=false
			wid.V.TrackImg[1]=true
		}	
	
	//COLORS
	wid.V.Title.Color={0:Color.black(),1:Color.white()}
	wid.V.Time.Color={0:new Color("#c61a09"),1:Color.white()}
	
	
		for (i=0;i<2;i++)
		{
			leftwid2ssessionele_titletime(wid.V.Title[i],wid.V.Title.Color[i], wid.V.Time[i],wid.V.Time.Color[i])
			
			//WEATHER INFO
			if(wid.V.Weather[i])
			{
				leftwid2ssessionele_weather(wid.V.Weather.img[i],wid.V.Weather.info[i],wid.V.Weather.addinfo[i])
			}
			
			//COUNTDOWN
			if(wid.V.Countdown[i] && !wid.V.Weather[i])
			{
				leftwid2ssessionele_countdown(wid.V.Days[i])
			}
			
			//TRACKIMG
			if(wid.V.TrackImg[i]&& !wid.V.Weather[i])
			{
				leftwid2ssessionele_trackimg()
			}
						
												
		}
		
		//FUNCTIONS-
	function	leftwid2ssessionele_titletime(titletxt,titlecolor,timetxt,timecolor)
	{
				//TITLE (RACE/SPRINT/QUALI)
	wid.Left.Box.QR[i].Title.Titiletxt= wid.Left.Box.QR[i].Title.addText(titletxt)
		wid.Left.Box.QR[i].Title.Titiletxt.font = Font.boldSystemFont(12)
		wid.Left.Box.QR[i].Title.Titiletxt.textColor =titlecolor
		//TIME - (21:00)
	wid.Left.Box.QR[i].Time.Timetxt = wid.Left.Box.QR[i].Time.addText(timetxt)
		wid.Left.Box.QR[i].Time.Timetxt.font = new Font("Menlo-Bold",18)
		wid.Left.Box.QR[i].Time.Timetxt.textColor = timecolor
	}
	
	function leftwid2ssessionele_weather(img,info,addinfo)
	{
		wid.Left.Box.QR[i].Cont.Wicon = wid.Left.Box.QR[i].Cont.addImage(img)
			wid.Left.Box.QR[i].Cont.Wicon.imageSize = new Size(70,45)
			
	//WEATHER INFO STACK&TXT
	wid.Left.Box.QR[i].Cont.Winfo=wid.Left.Box.QR[i].Cont.addStack()
		wid.Left.Box.QR[i].Cont.Winfo.size = new Size(78,14)
		wid.Left.Box.QR[i].Cont.Winfo.layoutHorizontally()
			
	wid.Left.Box.QR[i].Cont.Winfotxt= wid.Left.Box.QR[i].Cont.Winfo.addText(String(info))
		wid.Left.Box.QR[i].Cont.Winfotxt.font = new Font("Menlo-Regular",12)
		wid.Left.Box.QR[i].Cont.Winfotxt.minimumScaleFactor=0.2
		wid.Left.Box.QR[i].Cont.Winfotxt.textColor = new Color("1C1C1C")
		
		wid.Left.Box.QR[i].Cont.addSpacer(5)
		
		//WEATHER EINFO(EXTRA INFO) STACK&TXT | TEMP/MM
	wid.Left.Box.QR[i].Cont.Waddinfo=wid.Left.Box.QR[i].Cont.addStack()
 		wid.Left.Box.QR[i].Cont.Waddinfo.size = new Size(78,20)
 		wid.Left.Box.QR[i].Cont.Waddinfo.layoutHorizontally()
		wid.Left.Box.QR[i].Cont.Waddinfotxt = wid.Left.Box.QR[i].Cont.Waddinfo.addText(addinfo)
  	wid.Left.Box.QR[i].Cont.Waddinfotxt.font = new Font("Menlo-Bold",14)
  	wid.Left.Box.QR[i].Cont.Waddinfotxt.textColor = new Color("1c1c1c")
	}
	
	function leftwid2ssessionele_countdown(days)
	{
		wid.Left.Box.QR[0].Cont.Days=wid.Left.Box.QR[0].Cont.addStack()
		wid.Left.Box.QR[0].Cont.Days.size = new Size(78,40)
		wid.Left.Box.QR[0].Cont.Days.layoutHorizontally()
		wid.Left.Box.QR[0].Cont.Days.centerAlignContent()
		
		wid.Left.Box.QR[0].Cont.Daystxt= wid.Left.Box.QR[0].Cont.Days.addText(String(days))
 		wid.Left.Box.QR[0].Cont.Daystxt.font = new Font("Menlo-Bold",40)
 		wid.Left.Box.QR[0].Cont.Daystxt.textColor = new Color("1C1C1C")

	wid.Left.Box.QR[0].Cont.addSpacer(5)
	
		//"DAY"label STACK&TXT
	wid.Left.Box.QR[0].Cont.DayLable=wid.Left.Box.QR[0].Cont.addStack()
		wid.Left.Box.QR[0].Cont.DayLable.size = new Size(78,17)
		wid.Left.Box.QR[0].Cont.DayLable.layoutHorizontally()

	wid.Left.Box.QR[0].Cont.DayLabletxt = wid.Left.Box.QR[0].Cont.DayLable.addText("Days")
		wid.Left.Box.QR[0].Cont.DayLabletxt.font = new Font("Menlo-Regular",13)
		wid.Left.Box.QR[0].Cont.DayLabletxt.textColor = new Color("1c1c1c")

	}
	
	function	leftwid2ssessionele_trackimg()
	{
	wid.Left.Box.QR[1].Cont.addSpacer(2)
	//TRACK IMAGE
	wid.Left.Box.QR[1].Cont.Trackimg = wid.Left.Box.QR[1].Cont.addImage(trackimg)
	wid.Left.Box.QR[1].Cont.Trackimg.imageSize = new Size(78,60)
	}
	
	
	
	
}



function leftwidraceele()
{
	//RACE INFO

	//RACE TEXT
	wid.Left.Box.Race.Info.Rtxt=wid.Left.Box.Race.Info.addText("R")
		wid.Left.Box.Race.Info.Rtxt.font = Font.boldSystemFont(20)
		wid.Left.Box.Race.Info.Rtxt.textColor=Color.black()
		
	wid.Left.Box.Race.Info.Racetxt=wid.Left.Box.Race.Info.addText("ace")
		wid.Left.Box.Race.Info.Racetxt.font = Font.italicSystemFont(12)
		wid.Left.Box.Race.Info.Racetxt.textColor=Color.black()
	
	wid.Left.Box.Race.Info.addSpacer(40)
	//RACE TIME
	wid.Left.Box.Race.Info.Time=wid.Left.Box.Race.Info.addText(String(Time.USER.Race))
		wid.Left.Box.Race.Info.Time.font = new Font("Menlo-Bold",18)
		wid.Left.Box.Race.Info.Time.textColor=new Color("c61a09")

//WEATHER INFO
	//ICON
	wid.Left.Box.Race.Weather.Img = wid.Left.Box.Race.Weather.addImage(Weather.Race.Icon)
		wid.Left.Box.Race.Weather.Img.imageSize = new Size(45,45)
		
		wid.Left.Box.Race.Weather.addSpacer(10)
		
	//TEXT - TEMP/MM
	wid.Left.Box.Race.Weather.Showtxt = wid.Left.Box.Race.Weather.addText(String(Weather.Race.Show))
		wid.Left.Box.Race.Weather.Showtxt.font = new Font("Menlo-Italic",12)
		wid.Left.Box.Race.Weather.Showtxt.minimumScaleFactor=0.2
		wid.Left.Box.Race.Weather.Showtxt.textColor = new Color("1C1C1C")

// FAST INFO
	// TRACK MAP
	wid.Left.Box.Race.Fast.png= wid.Left.Box.Race.Fast.addImage(trackimg)
		wid.Left.Box.Race.Fast.png.imageSize = new Size(78,55)
}

function rightwidstack()
{
	wid.Right.Top10=wid.Right.addStack()
		wid.Right.Top10.size=new Size(171,155)
		wid.Right.Top10.layoutVertically()
		
	//TITLE
	wid.Right.Top10.addSpacer(3)
	
	wid.Right.Top10.Title = wid.Right.Top10.addStack()
		wid.Right.Top10.Title.setPadding(2,2,2,2)
		wid.Right.Top10.Title.size= new Size(171,18)
	
	//POSITION
	wid.Right.Top10.addSpacer(3)
	
	wid.Right.Top10.Pos = wid.Right.Top10.addStack()
		wid.Right.Top10.Pos.size = new Size(171,132)
	wid.Right.Top10.Pos.addSpacer(1)
}

function rightwidtop10()
{
	wid.V=[]
	wid.V.title=[],wid.V.titlecolor=[]
	
	wid.V.title="WDC",wid.V.titlecolor=Color.blue()
	wid.V.Posnametext=wdc

	rightwidtop10_title()
	//rightwidtop10_updatetime() UPDATE ON FUTURE VERSIONS
	rightwidtop10_wdc()
	
	function rightwidtop10_title()
	{
		//TITLE
	//LABLE STACK&TXT
	wid.Right.Top10.Title.Label=wid.Right.Top10.Title.addStack()
		wid.Right.Top10.Title.Label.size= new Size(33,15)
		wid.Right.Top10.Title.Label.cornerRadius=2
		wid.Right.Top10.Title.Label.centerAlignContent()
		wid.Right.Top10.Title.Label.setPadding(3,3,3,3)
		wid.Right.Top10.Title.Label.backgroundColor=wid.V.titlecolor
		
	wid.Right.Top10.Title.Label.txt=wid.Right.Top10.Title.Label.addText(wid.V.title)
		wid.Right.Top10.Title.Label.txt.font=new Font("Menlo-Bold",14)
	}
	
	function rightwidtop10_updatetime()
	{
			
	wid.Right.Top10.Title.addSpacer(80)
	
	//UPDATE TIME TXT
	wid.Right.Top10.Title.Updatetxt=wid.Right.Top10.Title.addText(String(utime))
		wid.Right.Top10.Title.Updatetxt.font=new Font("Menlo-Italics",12)

	wid.Right.Top10.Pos.Box=[],wid.V.Posnametxt=[]
	}

	function rightwidtop10_wdc()
	{
		wid.Right.Top10.Pos.Box=[]
		for(j=0;j<2;j++)//2 COLLONM
	{
	//BOX
	wid.Right.Top10.Pos.Box[j]= wid.Right.Top10.Pos.addStack()
			wid.Right.Top10.Pos.Box[j].size = new Size(85,132)
			wid.Right.Top10.Pos.Box[j].layoutVertically()
	wid.Right.Top10.Pos.Box[j].Tab=[]
			
	if(j==0)	
	{p=1}
	else if (j==1)
	{
		p=2
		wid.Right.Top10.Pos.Box[j].addSpacer(10)
	}
	
	for(i=0,p=p;i<5;i++,p+=2)
	{		
		//TAB
		wid.Right.Top10.Pos.Box[j].Tab[i]=wid.Right.Top10.Pos.Box[j].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].size=new Size(85,15)
		
				wid.Right.Top10.Pos.Box[j].addSpacer(10)
		//NO
		wid.Right.Top10.Pos.Box[j].Tab[i].No = wid.Right.Top10.Pos.Box[j].Tab[i].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.size = new Size(15,15)
			wid.Right.Top10.Pos.Box[j].Tab[i].No.backgroundColor = Color.white()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.conerRadius = 5
			//NOTE MAY CHANGE COLOR TO TEAM COLORS
		
		wid.Right.Top10.Pos.Box[j].Tab[i].No.txt = wid.Right.Top10.Pos.Box[j].Tab[i].No.addText(String(p))
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.font = new Font ("Futura-CondensedExtraBold",12)
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.textColor= Color.black()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.minimumScaleFactor=0.1
		
		
		//NAME
		wid.Right.Top10.Pos.Box[j].Tab[i].addSpacer(3)

		wid.Right.Top10.Pos.Box[j].Tab[i].Name = wid.Right.Top10.Pos.Box[j].Tab[i].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.size = new Size(57,15)
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.layoutVertically()
		
		
		
		wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt = wid.Right.Top10.Pos.Box[j].Tab[i].Name.addText(wid.V.Posnametext[p].toUpperCase())
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt.minimumScaleFactor=0.6
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt.font = new Font ("Futura-CondensedMedium",17)

	}
	}
	}
	
}


async function showwidget()
{
	await wid.presentMedium()
	Script.setWidget(wid)
}