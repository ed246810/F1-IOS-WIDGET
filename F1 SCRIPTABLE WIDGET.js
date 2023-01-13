// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: magic;

// --- LOCAL FILE ---
file = FileManager.local()
dir = file.documentsDirectory()
path = { "base": file.joinPath(dir, "F1-WID") }
//CREATE IF NEW
if (!file.fileExists(path.base)) {
	file.createDirectory(path.base, false)
}

//TXT PATH
path.D_F1 = path.base + "/D-F1.json"
path.D_F1live = path.base + "/D-F1live.json"

// --- DATE FORMATTER ---
let dF = new DateFormatter()

// --- DICTONARY ---
//WEATHER - SHORT DIS, LONG DIS , DAY ICON,NIGHT ICON
let Dic_weather = { 0: ["Clear", "Clear Sky", "01d", "01n"], 1: ["Clear", "Mainly Clear", "01d", "01n"], 2: ["Cloudy", "Partly Cloudy", "02d", "02n"], 3: ["Overcast", "Overcast", "04d", "04n"], 45: ["Fog", "Fog", "50d", "50d"], 46: ["Fog", "Depositing Rime Fog", "50d", "50d"], 51: ["Drizzle", "Light Drizzle", "09d", "09d"], 53: ["Drizzle", "Moderate Drizzle", "09d", "09d"], 55: ["Drizzle", "Dense Drizzle", "09d", "09d"], 56: ["Freezing Drizzle", "Freezing Light Drizzle", "09d"], 57: ["Freezing Drizzle", "Freezing Dense Drizzle", "09d"], 61: ["Rain", "Slight Rain", "10d", "10n"], 63: ["Rain", "Moderate Rain", "10d", "10n"], 65: ["Rain", "Heavy Rain", "09d", "09d"], 66: ["Freezing Rain", "Freezing Light Rain", "13d", "13d"], 67: ["Freezing Rain", "Freezing Heavy Rain", "13d", "13d"], 71: ["Snow", "Slight Snow Fall", "13d", "13d"], 73: ["Snow", "Moderate Snow Fall", "13d", "13d"], 75: ["Snow", "Heavy Snow Fall", "13d", "13d"], 77: ["Snow", "Snow Grains", "13d", "13d"], 80: ["Rain Showers", "Slight Rain Showers"], 81: ["Rain Showers", "Moderate Rain Showers", "09d", "09d"], 82: ["Rain Showers", "Violent Rain Showers", "09d", "09d"], 85: ["Snow Showers", "Slight Snow Showers", "13d", "13d"], 86: ["Snow Showers", "Heavy Snow Showers", "13d", "13d"], 95: ["Thunderstorm", "Thunderstorm", "11d", "11d"], 96: ["Thunderstorm", "Thunderstorm with slight hail", "11d", "11d"], 99: ["Thunderstorm", "Thunderstorm with heavy hail", "11d", "11d"] }

// --- API LINKS ---
//Base
Lf1 = "https://ergast.com/api/f1/current/"
Lf1live = "https://livetiming.formula1.com/static/"

LFlag = { "Base": 'https://restcountries.com/v3.1/name/', "End": '?fields=name,capital,currencies,flag,population,timezones,continents' }
Ltimezone = { "Base": "https://www.timeapi.io/api/TimeZone/coordinate?Latitiude=", "lon": "&longitude=" }
LWeather = { "Base": "https://api.open-meteo.com/v1/forecast?latitude=", "Lon": "&longitude=", "Tz": "&hourly=temperature_2m,precipitation,weathercode&timezone=", "End": "&past_days=1" }

//Lf1/Lf1live ENDING PATHS
//⚠️
Lf1 = {
	"Base": Lf1, "Next": "next.json",
	"Quali": "next/qualifying.json", "PrevRace": "last/results.json", "Sprint": "next/sprint.json", "WDC": "driverStandings.json", "WCC": "constructorStandings.json"
}

Lf1live = { "Base": Lf1live, "SessionInfo": "SessionInfo.json", "RaceControl": "RaceControlMessages.json", "TrackStatus": "TrackStatus.json", "LapCount": "LapCount.json", "DriverList": "DriverList.json", "StreamingStatus": "StreamingStatus.json" }

// --- FUNCTIONS ---
//GET DATA
async function fgetData(link) {
	req = await new Request(link)
	res = await req.loadJSON()
	return res
}

//DATE FORMAT
function fdateformat(format, datein) {
	let dat = new Date(datein)
	dF.dateFormat = format
	res = dF.string(dat)
	return res
}

//GET TIMEZONE
async function fgettimezone(lat, lon) {
	Link = Ltimezone.Base + lat + Ltimezone.lon + lon
	res = await fgetData(Link)
	res = res.timeZone
	return res
}

//DAYS/HRS/MIN TO DATE
async function fdminus(date) {
	let d = new Date(date)
	let now = new Date()
	let diffMs = (d - now); // milliseconds
	let diffMins = Math.round(((diffMs / 1000) / 60)) //Mintues
	let diffHrs = Math.round((diffMins / 60))
	let diffDays = Math.round((diffHrs / 24))
	log(diffDays + "Days, " + diffHrs + "Hours, " + diffMins + "Minutes")
	return [diffDays, diffHrs, diffMins]
}

//GET(EXTRACT) WEATHER INFO
function fweatherinfo(time, dark) {
	log(time)
	//REFORMAT FOR API DATE
	YYMMDD = fdateformat("YYYY-MM-dd", time)
	log(YYMMDD)
	HH = fdateformat("HH", time)
	log(HH)
	DT = YYMMDD + "T" + HH + ":00"
	log(DT)

	//GETING NO.
	for (i = 0, fw = 0; fw != DT && fw != undefined; i++) {
		werror = false
		fw = Dweather.hourly.time[i]
		//log("WEATHER NO ("+i+") - "+fw)
	}
	if (fw == undefined) {
		i = i - 1 //BACKTRACK (TO NO ERROR)
		werror = true //WEATHER DATA ISNT ACCURATE (DATE)
		log("w ERROR")
	}

	i = i - 1 //OFFSET
	log(i + "- WEATHER NO - " + Dweather.hourly.time[i])

	//TEMP,MM,CODE
	temp = Dweather.hourly.temperature_2m[i]
	mm = Dweather.hourly.precipitation[i]
	code = Dweather.hourly.weathercode[i]

	//CODE - INFO CODE NO
	Codeinfo = Dic_weather[code]
	Weatherinfo = Codeinfo[0]
	if (dark == true) {
		Weathercode = Codeinfo[3]
	}
	else if (dark == false) {
		Weathercode = Codeinfo[2]
	}

	if ((mm < 1) || (Weatherinfo = ! "Drizzle") || (Weatherinfo = !"Rain")) {
		wshow = "🌡️" + temp + "°C"  //SET 0 TO SHOW TEMP
	}
	else {
		wshow = "💧 " + mm + " mm"
	}

	log("WEATHER CODE - " + Weathercode + " | WEATHER INFO - " + Weatherinfo)
	log("TEMP - " + temp + " | MM RAIN - " + mm + " | SHOW - " + wshow)
	//wshow - What to show
	return [wshow, Weathercode, Weatherinfo, temp, mm]

}

//TRACK IMAGE
function fgettrackimg(c) {
	if (c == false) {
		racename = D_F1.Next.MRData.RaceTable.Races[0].raceName
		r1 = racename.replace("Grand Prix", "")
	}
	else if (c == true) {
		r1 = Vcountry + " "
	}
	code = r1.replaceAll(" ", "%20")
	log(code)
	link = "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/" + code + "carbon.png.transform/8col/image.png"
	res = new Request(link).loadImage()
	return res
}
// ---- END FUNCTIONS ---------------------
//UPDATE DATE TIME
utime = fdateformat("HH:mm", Date())
log(utime)

//APIS
log("--- GETTING APIS ---")
try {	//RETRIVE FROM API
	// ---- LF1 DATA ---
	D_F1 = await Promise.all([
		fgetData(Lf1.Base + Lf1.Next), //0 - NEXT
		fgetData(Lf1.Base + Lf1.Quali), //1 - QUALI(NEXT)
		fgetData(Lf1.Base + Lf1.PrevRace), //2 - RACE (PREVIOUS)
		fgetData(Lf1.Base + Lf1.Sprint), //3 - SPRINT (NEXT)
		fgetData(Lf1.Base + Lf1.WDC), //4 - WDC
		fgetData(Lf1.Base + Lf1.WCC), //5 - WCC
	])
	//log(D_F1)

	D_F1 =
	{
		"Next": D_F1[0],
		"Quali": D_F1[1], "PrevRace": D_F1[2], "Sprint": D_F1[3],
		"WDC": D_F1[4], "WCC": D_F1[5], "Updated": Date()
	}
	log("+ D_F1 DONE")

	//--- LF1 LIVE DATA ---
	//GET PATH FIRST
	Lf1live.Path = await fgetData(Lf1live.Base + Lf1live.SessionInfo)
	Lf1live.Path = Lf1live.Path.Path
	VF1_Path = Lf1live.Path
	//log("Lf1live.Path/VF1_Path"+Lf1live.Path)

	D_F1live = await Promise.all([
		fgetData(Lf1live.Base + Lf1live.SessionInfo),//0 - SESSION INFO
		fgetData(Lf1live.Base + Lf1live.Path + Lf1live.RaceControl),//1 - RACE CONTROL MSG
		fgetData(Lf1live.Base + Lf1live.Path + Lf1live.TrackStatus),//2- TRACK STATUS
		fgetData(Lf1live.Base + Lf1live.Path + Lf1live.LapCount),//3 - LAP COUNT
		fgetData(Lf1live.Base + Lf1live.Path + Lf1live.DriverList),//4-DRIVER LIST
		fgetData(Lf1live.Base + Lf1live.StreamingStatus),//5-STREAMING STATUS
	])
	//log(D_F1live)

	D_F1live = {
		"SessionInfo": D_F1live[0], "RaceControl": D_F1live[1], "TrackStatus": D_F1live[2], "LapCount": D_F1live[3], "DriverList": D_F1live[4], "StreamingStatus": D_F1live[5], "Updated": Date()
	}
	log("+ LF1LIVE RECIVED DATA")
	//SAVE TO LOCAL
	file.writeString(path.D_F1, JSON.stringify(D_F1))
	file.writeString(path.D_F1live, JSON.stringify(D_F1live))
	Buselocal = false
	log("💾 SAVED TO LOCAL")
}
catch (err)	//RETRIVE FROM LOCAL FILE
{
	log("USING LOCAL FILES")
	log("err - " + err)
	D_F1 = await file.readString(path.D_F1)
	D_F1live = await file.readString(path.D_F1live)
	D_F1 = await JSON.
		parse(D_F1)
	D_F1live = await JSON.
		parse(D_F1live)
	log("📇LOADED FROM LOCAL")
	Buselocal = true
}

// --- USER INFO ---
//USER TIME ZONE
VtzUSER = Intl.DateTimeFormat().resolvedOptions().timeZone
log("VtzUSER - " + VtzUSER)

//---TRACK INFO---
log("--- TRACK INFO")
Vraceround = D_F1.Next.MRData.RaceTable.Races[0].round
Vracename = D_F1.Next.MRData.RaceTable.Races[0].raceName
Vtrack = D_F1.Next.MRData.RaceTable.Races[0].Circuit.Location.locality

Vcountry = D_F1.Next.MRData.RaceTable.Races[0].Circuit.Location.country
Vflag = await fgetData(LFlag.Base + Vcountry + LFlag.End)
Vflag = Vflag[0].flag

Vlat = D_F1.Next.MRData.RaceTable.Races[0].Circuit.Location.lat
Vlon = D_F1.Next.MRData.RaceTable.Races[0].Circuit.Location.long
VtzLOCAL = await fgettimezone(Vlat, Vlon)

log("Vraceround - " + Vraceround + " | Vracename - " + Vracename + " | Vtrack - " + Vtrack + " | Vcountry - " + Vcountry + "| Vflag - " + Vflag + " | Vlat - " + Vlat + " | Vlon - " + Vlon + " | VtzLOCAL - " + VtzLOCAL)

//--- FLAG ---

//--- TRACK IMG MAP ---
log("--- TRACK IMG")
try {
	Vtrackimg = await fgettrackimg(false)
}
catch (err) {
	log(err)
	log("ERROR - RUN VIA COUNTRY NAME")
	Vtrackimg = await fgettrackimg(true)
}
log("got img track")

// --- RACE/QUALI DATE TIME ---
//0SPRINT 1QUALI 2RACE
log("--- QUALI/RACE DATE/TIME")
VdatetimeUSER = {
	1: new Date(D_F1.Next.MRData.RaceTable.Races[0].Qualifying.date + "T" + D_F1.Next.MRData.RaceTable.Races[0].Qualifying.time),
	2: new Date(D_F1.Next.MRData.RaceTable.Races[0].date + "T" + D_F1.Next.MRData.RaceTable.Races[0].time)
}
log("VdatetimeUSER | 1 - " + VdatetimeUSER[1] + " 2 - " + VdatetimeUSER[2])

VdateUSER = {
	1: new Intl.DateTimeFormat('arn-CL').format(VdatetimeUSER[1]),
	2: new Intl.DateTimeFormat('arn-CL').format(VdatetimeUSER[2])
}
log("VdateUSER | 1 - " + VdateUSER[1] + " 2 - " + VdateUSER[2])

VtimeUSER = {
	1: new Intl.DateTimeFormat('arn-CL', { hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[1]),
	2: new Intl.DateTimeFormat('arn-CL', { hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[2])
}
log("VtimeUSER | 1 - " + VtimeUSER[1] + " 2 - " + VtimeUSER[2])

VdateUTC = {
	1: new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT" }).format(VdatetimeUSER[1]),
	2: new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT" }).format(VdatetimeUSER[2])
}
log("VdateUTC | 1 - " + VdateUTC[1] + " 2 - " + VdateUTC[2])

VtimeUTC = {
	1: new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT", hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[1]),
	2: new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT", hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[2])
}
log("VtimeUTC | 1 - " + VtimeUTC[1] + " 2 - " + VtimeUTC[2])

//dd,mm | day,month -QUALI RACE
Vdd = { 1: fdateformat("dd", VdatetimeUSER[1]), 2: fdateformat("dd", VdatetimeUSER[2]) }
Vmm = { 1: fdateformat("MMM", VdatetimeUSER[1]), 2: fdateformat("MMM", VdatetimeUSER[2]) }
log("Vdd | 1 - " + Vdd[1] + " 2 - " + Vdd[2])
log("Vmm | 1 - " + Vmm[1] + " 2 - " + Vmm[2])

//FREE PRACTICE TIME
Vfp1 = []
Vfp1.dt = new Date(D_F1.Next.MRData.RaceTable.Races[0].FirstPractice.date + "T" + D_F1.Next.MRData.RaceTable.Races[0].FirstPractice.time)
Vfp1.dateUSER = new Intl.DateTimeFormat('arn-CL').format(Vfp1.dt),
	Vfp1.timeUSER = new Intl.DateTimeFormat('arn-CL', { hour12: false, hour: "2-digit", minute: "2-digit" }).format(Vfp1.dt)
Vfp1.dd = fdateformat("dd", Vfp1.dt)
Vfp1.mm = fdateformat("MMM", Vfp1.dt)

log("Vfp1.dt - " + Vfp1.dt + " |.dateUSER - " + Vfp1.dateUSER + " |.timeUSER - " + Vfp1.timeUSER + " |.dd - " + Vfp1.dd + " |.mm - " + Vfp1.mm)

// --- CHECK SPRINT --- 
log("--- CHECK SPRINT")
Bsprint = D_F1.Next.MRData.RaceTable.Races[0].Sprint
if (Bsprint == undefined) {
	Bsprint = false
	log("No Sprint")
}
else if (Bsprint != undefined) {
	Bsprint = true
	log("There is Sprint")
}

if (Bsprint == true) {
	// --- SPTINT DATE TIME ---
	//0SPRINT
	log("--- SPTINT DATE/TIME")
	VdatetimeUSER[0] = new Date(D_F1.Next.MRData.RaceTable.Races[0].Sprint.date + "T" + D_F1.Next.MRData.RaceTable.Races[0].Sprint.time),
		log("VdatetimeUSER (SPRINT/0) - " + VdatetimeUSER[0])

	VdateUSER[0] = new Intl.DateTimeFormat('arn-CL').format(VdatetimeUSER[0]),
		log("VdateUSER (SPRINT/0) - " + VdateUSER[0])

	VtimeUSER[0] = new Intl.DateTimeFormat('arn-CL', { hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[0])
	log("VtimeUSER (SPRINT/0) - " + VtimeUSER[0])

	VdateUTC[0] = new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT" }).format(VdatetimeUSER[0])
	log("VdateUTC (SPRINT/0) - " + VdateUTC[0])

	VtimeUTC = new Intl.DateTimeFormat('arn-CL', { timeZone: "GMT", hour12: false, hour: "2-digit", minute: "2-digit" }).format(VdatetimeUSER[0])
	log("VtimeUTC (SPRINT/0) - " + VtimeUTC)
}

// --- COUNTDOWN --- 
//1QUALI 2RACE	| 0DAY1HR2MIN
log("--- QUALI/RACE COUNTDOWN")
Vdminus = { 1: await fdminus(VdatetimeUSER[1]), 2: await fdminus(VdatetimeUSER[2]) }
//COUNTDOWN
VDays = { 1: Vdminus[1][0], 2: Vdminus[2][0] }
VHrs = { 1: Vdminus[1][1], 2: Vdminus[2][1] }
VMins = { 1: Vdminus[1][2], 2: Vdminus[2][2] }

//SPRINT (0)
if (Bsprint == true) {
	log("--- SPRINT COUNTDOWN")
	// 0DAY1HR2MIN
	Vdminus[0] = await fdminus(VdatetimeUSER[0])
	//COUNTDOWM
	VDays[0] = Vdminus[0][0]
	VHrs[0] = Vdminus[0][1]
	VMins[0] = Vdminus[0][2]
}

//--- QUALI RESULT ---

//CHECK QUALI RESULT
log("--- CHECK QUALI RESULT OUT")
BQualiRes = D_F1.Quali.MRData.RaceTable.Races[0]
if (BQualiRes == undefined) {
	BQualiRes = false
	log("No QUALI RESULT")
}
else if (BQualiRes != undefined) {
	BQualiRes = true
	log("+ QUALI RESULT OUT")
}

//QUALI RESULT
if (BQualiRes == true) {
	log("--- QUALI RESULT")
	//P1 - 20
	VQualiPos = [], VQualiSpeed = []
	for (i = 0, p = 1; i < 20; p++, i++) {
		//POSITION
		try {
			VQualiPos[p] = await D_F1.Quali.MRData.RaceTable.Races[0].QualifyingResults[i].Driver.code
		}
		catch (err) {
			VQualiPos[p] = ""
		}
		//FASTEST LAP Q3 TOP 10,Q2 11-15,Q1 REST
		if (p < 11) {
			VQualiSpeed[p] = await D_F1.Quali.MRData.RaceTable.Races[0].QualifyingResults[i].Q3
		}
		if (p > 10 && p < 16 || VQualiSpeed[p] == undefined) {
			VQualiSpeed[p] = await D_F1.Quali.MRData.RaceTable.Races[0].QualifyingResults[i].Q2
		}
		if (p > 15 || VQualiSpeed[p] == undefined) {
			VQualiSpeed[p] = await D_F1.Quali.MRData.RaceTable.Races[0].QualifyingResults[i].Q1
		}
	}
	//LOG POS/SPEED
	log("VQualiPos - " + VQualiPos)
	log("VQualiSpeed - " + VQualiSpeed)
}

//--- SPRINT RESULT ---
if (Bsprint == true) {
	//CHECK SPRINT RESULT OUT
	log("--- CHECK SPRINT RESULT OUT")
	BSprintRes = D_F1.Sprint.MRData.RaceTable.Races[0]
	if (BSprintRes == undefined) {
		BSprintRes = false
		log("No SPRINT RESULT")
	}
	else if (BSprintRes != undefined) {
		BSprintRes = true
		log("+ SPRINT RESULT OUT")
	}
	if (BSprintRes == true) {
		VSprintPos = []
		//GET SPRINT RES
		log("--- SPRINT RESULT")
		for (i = 0, p = 1; i < 20; p++, i++) {
			//POSITION
			try {
				VSprintPos[p] = await D_F1.Sprint.MRData.RaceTable.Races[0].SprintResults[i].Driver.code
			}
			catch (err) {
				VQualiPos[p] = ""
			}
		}
		log("VSprintPos - " + VSprintPos)
	}
}

//--- PREV RACE RESULT ---
//IF RACE FINISH WITHIN 3 DAYS DATA TO BE SHOWN ELSE DONT
log("--- PREV RACE RESULT")
VprevRacedt = await D_F1.PrevRace.MRData.RaceTable.Races[0].date + "T" + await D_F1.PrevRace.MRData.RaceTable.Races[0].time
log("VprevRacedt - " + VprevRacedt)
Vprevrminus = await fdminus(VprevRacedt)
if (Vprevrminus[0] < -3) {
	BprevRace = false
	log("NO PREV RACE RESULT")
}
else if (Vprevrminus[0] > -3) {
	BprevRace = true
	log("--- LOADING PREV RACE RESULT")
}

if (BprevRace == true) {
	log("PREV RACE RESULT")
	VprevPos = []
	for (i = 0, p = 1; i < 20; i++, p++) {
		try {
			VprevPos[p] = await D_F1.PrevRace.MRData.RaceTable.Races[0].Results[i].Driver.code
		}
		catch (err) {
			VprevPos[p] = ""
		}
	}
	log("VprevPos - " + VprevPos)
}

//--- WDC ---
log("--- WDC")
//TOTAL DRIVER IN WDC
Vwdctotal = await D_F1.WDC.MRData.total
log("Vwdctotal - " + Vwdctotal)

//WDC STANDINGS
VWDC = [], AllDriverNumber = []
for (i = 0, p = 1; i < Vwdctotal; i++, p++) {
	//WDC STANDINGS
	VWDC[p] = await D_F1.WDC.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver.familyName
	//DRIVER NUMBER VIA WDC (NO1 IS NOT INDCATED)
	AllDriverNumber[p] = D_F1.WDC.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver.permanentNumber
}
AllDriverNumber[0] = 1
log("VWDC - " + VWDC)
log("AllDriverNumber - " + AllDriverNumber)

//--- WCC ---
log("--- WCC")
//TOTAL TEAM
Vwcctotal = await D_F1.WCC.MRData.total
log("Vwcctotal - " + Vwcctotal)
//WCC STANDINGS
VWCC = []
for (i = 0, p = 1; i < Vwcctotal; i++, p++) {
	VWCC[p] = await D_F1.WCC.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i].Constructor.name
}
log("VWCC - " + VWCC)

//LF1 LIVE DATA
//SESSION INFO
VF1_Name = D_F1live.SessionInfo.Meeting.Name
log("VF1_Name - " + VF1_Name)
if (VF1_Name != Vracename) {
	BF1DATA = false
	log("BF1DATA & BF1WEATHER FALSE")
}
if (VF1_Name == Vracename) {
	log("BF1DATA TRUE")
	BF1DATA = true
	VF1_StreamingStatus = D_F1live.StreamingStatus.Status
	log(VF1_StreamingStatus)
	VF1_TrackStatus = D_F1live.TrackStatus.Message
	log(VF1_TrackStatus)
}

//DRIVERS INFO
VF1_DriverColor = [], VF1_Driverpng = []
for (i = 0; i < 100; i++) {
	try {
		data = D_F1live.DriverList[i].Tla
	}
	catch (err) {
		data = undefined
	}
	if (data != undefined) {
		//TEAM COLOR
		VF1_DriverColor[data] = D_F1live.DriverList[i].TeamColour
		//HEADSHOT
		VF1_Driverpng[data] = D_F1live.DriverList[i].HeadshotUrl
	}
}
log("GOT HEADSHOT LINK & DRIVER COLOR")

//--- WEATHER ---
tz = VtzUSER.replace("/", "%2F")
log(tz)

log("--- WEATHER")
Dweather = await fgetData(LWeather.Base + Vlat + LWeather.Lon + Vlon + LWeather.Tz + tz + LWeather.End)
//log(Dweather)


Bweather = [], Vweather = []
if (VDays[1] < 6 && VMins[1] > -80)//QUALI
{
	log("^Quali Weather")
	Bweather[1] = true
	Vweather[1] = fweatherinfo(VdatetimeUSER[1], true)
	Vweather[1] = { "Show": Vweather[1][0], "Code": Vweather[1][1], "Info": Vweather[1][2], "Temp": Vweather[1][3], "mm": Vweather[1][4] }
	log(Vweather[1])
}
if (VDays[2] < 6 && VMins[2] > -190)	//RACE
{
	log("^Race Weather")
	Bweather[2] = true
	Vweather[2] = fweatherinfo(VdatetimeUSER[2], true)
	Vweather[2] = { "Show": Vweather[2][0], "Code": Vweather[2][1], "Info": Vweather[2][2], "Temp": Vweather[2][3], "mm": Vweather[2][4] }
	log(Vweather[2])
}
if (VDays[0] < 6 && Bsprint == true && VMins[0] > -90)	//SPRINT
{
	log("^Sprint Weather")
	Bweather[0] = true
	Vweather[0] = fweatherinfo(VdatetimeUSER[0], true)
	log(Vweather[0])
	Vweather[0] = { "Show": Vweather[0][0], "Code": Vweather[0][1], "Info": Vweather[0][2], "Temp": Vweather[0][3], "mm": Vweather[0][4] }
	log(Vweather[0])
}

// **--------- WIDGET ----------*
//CREATE WIDGET
wid = new ListWidget()
wid.backgroundColor = Color.black()

wid.All = wid.addStack()
wid.All.size = new Size(342, 155)
wid.All.layoutHorizontally()

wid.Left = wid.All.addStack()
wid.Left.size = new Size(171, 155)
wid.Left.layoutVertically()

wid.Right = wid.All.addStack()
wid.Right.size = new Size(171, 155)
//LEFT(L)-------------------------------STACKS
//LEFT TITLE --- STACK
wid.Left.Title = wid.Left.addStack()
wid.Left.Title.size = new Size(171, 20)
wid.Left.Title.setPadding(2, 2, 2, 2)
wid.Left.Title.layoutHorizontally()
wid.Left.Title.centerAlignContent()

wid.Left.addSpacer(5)

//LEFT BOX --- STACK
wid.Left.Box = wid.Left.addStack()
wid.Left.Box.size = new Size(171, 122)
wid.Left.Box.centerAlignContent()
wid.Left.Box.addSpacer(8)

//COUNTDOWN - IF MORE THAN 15 DAYS
if (VDays[1] > 7) {
	//COUNTDOWN
	log("WIDGET - COUNTDOWN")
	//COUNT	
	wid.Left.Box.Countdown = wid.Left.Box.addStack()
	wid.Left.Box.Countdown.size = new Size(156, 120)
	wid.Left.Box.Countdown.layoutVertically()
	wid.Left.Box.Countdown.cornerRadius = 8

	//TRACK
	wid.Left.Box.Countdown.Track = wid.Left.Box.Countdown.addStack()
	wid.Left.Box.Countdown.Track.size = new Size(156, 70)
	wid.Left.Box.Countdown.Track.layoutHorizontally()
	wid.Left.Box.Countdown.Track.backgroundColor = new Color("#c3c3c3")
	//COUNT
	wid.Left.Box.Countdown.Count = wid.Left.Box.Countdown.addStack()
	wid.Left.Box.Countdown.Count.size = new Size(156, 50)
	wid.Left.Box.Countdown.Count.layoutHorizontally()
	wid.Left.Box.Countdown.Count.backgroundColor = new Color("#b4b4b4")

}
//LEFT QUALI RACE BOX
else if ((Bsprint == false && VMins[1] > -100) || (Bsprint == true && VMins[0] > -100)) {
	//QUALI RACE BOX
	//WHEN SPRINT&QUALI IS NOT OVER 
	//DISPLAY TIME, WEATHER/MAP/COUNTDOWN

	log("WIDGET - QUALI&RACE BOX")
	//LEFT BOX(WL)
	//LEFT QUALI RACE(BOX) --- STACK
	wid.Left.Box.QR = wid.Left.Box.addStack()
	wid.Left.Box.QR.size = new Size(156, 120)
	wid.Left.Box.QR.cornerRadius = 8
	wid.Left.Box.QR.layoutHorizontally()

	//LEFT-QR A/B(BOX)(WLQR)
	//BOX A (QUALI MINI BOX)
	wid.Left.Box.QR[0] = wid.Left.Box.QR.addStack()
	wid.Left.Box.QR[0].size = new Size(78, 120)
	wid.Left.Box.QR[0].layoutVertically()
	wid.Left.Box.QR[0].backgroundColor = new Color("#c3c3c3")
	//BOX B (RACE MINI BOX)
	wid.Left.Box.QR[1] = wid.Left.Box.QR.addStack()
	wid.Left.Box.QR[1].size = new Size(78, 120)
	wid.Left.Box.QR[1].layoutVertically()
	wid.Left.Box.QR[1].backgroundColor = new Color("#b4b4b4")

	//*LEFT QR BOX A/B

	for (i = 0; i < 2; i++) {
		wid.Left.Box.QR[i].addSpacer(3)

		//TITLE --- STACK
		wid.Left.Box.QR[i].Title = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Title.size = new Size(78, 15)
		wid.Left.Box.QR[i].Title.layoutHorizontally()

		//TIME --- STACK
		wid.Left.Box.QR[i].Time = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Time.size = new Size(78, 22)
		wid.Left.Box.QR[i].Time.layoutHorizontally()

		//CONTENT --- STACK
		wid.Left.Box.QR[i].Cont = wid.Left.Box.QR[i].addStack()
		wid.Left.Box.QR[i].Cont.size = new Size(78, 80)
		wid.Left.Box.QR[i].Cont.layoutVertically()
		wid.Left.Box.QR[i].Cont.topAlignContent()

	}
}
else if ((Bsprint == false && VMins[1] <= -100) || (Bsprint == true && VMins[0] < -100)) {
	//RACE BOX
	//WHEN QUALI/SPRINT OVER & RACE NOT OVER YET
	//DISPLAY TIME,MAP,WEATHER
	log("WIDGET - RACE BOX")
	//RACE BOX --- STACK
	wid.Left.Box.Race = wid.Left.Box.addStack()
	wid.Left.Box.Race.size = new Size(156, 120)
	wid.Left.Box.Race.cornerRadius = 8
	wid.Left.Box.Race.layoutVertically()


	//RINFO --- STACK
	wid.Left.Box.Race.Info = wid.Left.Box.Race.addStack()
	wid.Left.Box.Race.Info.size = new Size(156, 25)
	wid.Left.Box.Race.Info.bottomAlignContent()
	wid.Left.Box.Race.Info.backgroundColor = new Color("#c3c3c3")

	//RWEATHER --- STACK
	wid.Left.Box.Race.Weather = wid.Left.Box.Race.addStack()
	wid.Left.Box.Race.Weather.size = new Size(156, 40)
	wid.Left.Box.Race.Weather.centerAlignContent()
	wid.Left.Box.Race.Weather.backgroundColor = new Color("#c3c3c3")

	//RFAST --- STACK
	wid.Left.Box.Race.Fast = wid.Left.Box.Race.addStack()
	wid.Left.Box.Race.Fast.size = new Size(156, 55)
	wid.Left.Box.Race.Fast.layoutHorizontally()
	wid.Left.Box.Race.Fast.backgroundColor = new Color("#b4b4b4")
}
//BOX 3 IDEA BIG COUNTDOWN FOR RACES LONGER THAN 14 DAYS
//LEFT(L)-------------------------------STACKS

//E*LEFT ELEMENTS*---------------------ELEMENTS

//LEFT TITLE ELEMENTS

//LIVE REC
//to set diff color for future versions	
wid.Left.Title.LiveRec = wid.Left.Title.addStack()
wid.Left.Title.LiveRec.size = new Size(17, 17)
wid.Left.Title.LiveRec.cornerRadius = 2
wid.Left.Title.LiveRec.backgroundColor = Color.blue()

wid.Left.Title.addSpacer(8)

//VAR TRACK/CIRCUIT TXT
wid.Left.Title.Circuit_txt = wid.Left.Title.addText(Vtrack)
wid.Left.Title.Circuit_txt.minimumScaleFactor = 0.01
wid.Left.Title.Circuit_txt.font = Font.boldMonospacedSystemFont(15)

wid.Left.Title.addSpacer(5)

//VAR FLAG TXT
wid.Left.Title.Flag = wid.Left.Title.addText(Vflag)
wid.Left.Title.Flag.font = Font.boldSystemFont(18);
wid.Left.Title.Flag.textColor = Color.white();
//COUNTDOWN
if (VDays[1] > 14)//QUALI 14 DAYS OR MORE
{//COUNTDOWN
	log("WIDGET ELEMENT - COUNTDOWN")
	//TRACK LAYOUT
	wid.Left.Box.Countdown.Track.Trackimg = wid.Left.Box.Countdown.Track.addImage(Vtrackimg)
	wid.Left.Box.Countdown.Track.Trackimg.imageSize = new Size(156, 65)
	//COUNT
	wid.Left.Box.Countdown.Count.addSpacer(15)
	//DAY
	wid.Left.Box.Countdown.Count.Day = wid.Left.Box.Countdown.Count.addStack()
	wid.Left.Box.Countdown.Count.Day.size = new Size(50, 50)
	wid.Left.Box.Countdown.Count.Day.layoutVertically()

	wid.Left.Box.Countdown.Count.Day.txt = wid.Left.Box.Countdown.Count.Day.addText(String(VDays[1]))
	wid.Left.Box.Countdown.Count.Day.txt.font = new Font("Menlo-Bold", 40)
	wid.Left.Box.Countdown.Count.Day.txt.textColor = new Color("1C1C1C")

	wid.Left.Box.Countdown.Count.addSpacer(6)
	//"DAY TO"
	wid.Left.Box.Countdown.Count.DayTo = wid.Left.Box.Countdown.Count.addStack()
	wid.Left.Box.Countdown.Count.DayTo.size = new Size(85, 50)
	wid.Left.Box.Countdown.Count.DayTo.layoutVertically()

	wid.Left.Box.Countdown.Count.DayTo.txt = wid.Left.Box.Countdown.Count.DayTo.addText("Days To Quali")
	wid.Left.Box.Countdown.Count.DayTo.txt.font = new Font("Menlo-Italic", 13)
	wid.Left.Box.Countdown.Count.DayTo.txt.textColor = new Color("1C1C1C")

}
//LEFT QUALI RACE BOX
else if ((Bsprint == false && VMins[1] > -100) || (Bsprint == true && VMins[0] > -100)) {
	//WHEN SPRINT.QUALI IS NOT OVER
	//DISPLAY QUALI/RACE - QUALI/SPRINT - SPRINT/RACE
	//TIME,WEATHER INFO

	log("WIDGET ELEMENT - SPRINT QUALI RACE BOX")

	//LOOP VAR
	wid.V = [], wid.V.Title = [], wid.V.Time = [], wid.V.Days = [], wid.V.Wcode = [], wid.V.Winfo = [], wid.V.Waddinfo = []



	if (Bsprint == true && VMins[1] > -100) {//SPRINT WEEKEND QUALI HAVENT EMD
		wid.V.Title[0] = "Quali", wid.V.Title[1] = "Sprint"
		i0 = 1, i1 = 0
	}
	else if (Bsprint == true && VMins[1] < -100) {//SPRINT WEEKEND, QUALI ENDED
		//SPRINT,RACE
		wid.V.Title[0] = "Sprint", wid.V.Title[1] = "Race"
		i0 = 0, i1 = 2
	}
	else {//NON SPRINT WEEKEND *QUALI NOT OVER
		//QUALI,RACE
		wid.V.Title[0] = "Quali", wid.V.Title[1] = "Race"
		i0 = 1, i1 = 2
	}
	log(wid.V.Title[0] + wid.V.Title[1])

	//TIME / DAYS TO
	wid.V.Time[0] = VtimeUSER[i0], wid.V.Time[1] = VtimeUSER[i1]
	wid.V.Days[0] = VDays[i0], wid.V.Days[1] = VDays[i1]

	//LEFT BOX
	if (Bsprint == true && VMins[1] > -100) {//SPRINT WEEKEND,QUALI SESSION HAVENT ENDED
		//QUALI,SPRINT
		//BOX A WEATHER
		if (wid.V.Days[0] < 6) {
			wid.V.Wcode[0] = Vweather[i0].Code, wid.V.Winfo[0] = Vweather[i0].Info, wid.V.Waddinfo[0] = Vweather[i0].Show
		}
		//BOX B WEATHER
		if (wid.V.Days[0] < 6) {
			wid.V.Wcode[1] = Vweather[i1].Code, wid.V.Winfo[1] = Vweather[i1].Info, wid.V.Waddinfo[1] = Vweather[i1].Show
		}
		log(wid.V.Days[0])

		//TITLE COLOR(RACE/SPRINT/QUALI)
		//BLACK FOR BOX A | WHITE FOR BOX B
		wid.V.Title.Color = { 0: Color.black(), 1: Color.white() }
		//TIME COLOR
		//RED FOR BOX A | WHITE FOR BOX B
		wid.V.Time.Color = { 0: new Color("#c61a09"), 1: Color.white() }

		//TITLE-TIME-WEATHER INFO(CONT)
		for (i = 0; i < 2; i++) {
			//TITLE (RACE/SPRINT/QUALI)
			wid.Left.Box.QR[i].Title.Titiletxt = wid.Left.Box.QR[i].Title.addText(wid.V.Title[i])
			wid.Left.Box.QR[i].Title.Titiletxt.font = Font.boldSystemFont(12)
			wid.Left.Box.QR[i].Title.Titiletxt.textColor = wid.V.Title.Color[i]
			//TIME - (21:00)
			wid.Left.Box.QR[i].Time.Timetxt = wid.Left.Box.QR[i].Time.addText(wid.V.Time[i])
			wid.Left.Box.QR[i].Time.Timetxt.font = new Font("Menlo-Bold", 18)
			wid.Left.Box.QR[i].Time.Timetxt.textColor = wid.V.Time.Color[i]
			//CONTENT - WEATHER

			//WEATHER INFO
			if (wid.V.Days[i] < 6)//ADD IF not FINISH END OR CHANGE TO B WEATHER
			{//IF LESS THAN 5 DAYS | DISPLAY WEATHER WHEN THERE IS WEATHER
				//ICON IMG
				res = await new Request("http://openweathermap.org/img/wn/" + wid.V.Wcode[i] + "@2x.png").loadImage()//CHANGE LINK TO VAR
				wid.Left.Box.QR[i].Cont.Wicon = wid.Left.Box.QR[i].Cont.addImage(res)
				wid.Left.Box.QR[i].Cont.Wicon.imageSize = new Size(70, 45)

				//WEATHER INFO STACK&TXT
				wid.Left.Box.QR[i].Cont.Winfo = wid.Left.Box.QR[i].Cont.addStack()
				wid.Left.Box.QR[i].Cont.Winfo.size = new Size(78, 14)
				wid.Left.Box.QR[i].Cont.Winfo.layoutHorizontally()

				wid.Left.Box.QR[i].Cont.Winfotxt = wid.Left.Box.QR[i].Cont.Winfo.addText(String(wid.V.Winfo[i]))
				wid.Left.Box.QR[i].Cont.Winfotxt.font = new Font("Menlo-Regular", 12)
				wid.Left.Box.QR[i].Cont.Winfotxt.minimumScaleFactor = 0.2
				wid.Left.Box.QR[i].Cont.Winfotxt.textColor = new Color("1C1C1C")

				wid.Left.Box.QR[i].Cont.addSpacer(5)

				//WEATHER EINFO(EXTRA INFO) STACK&TXT | TEMP/MM
				wid.Left.Box.QR[i].Cont.Waddinfo = wid.Left.Box.QR[i].Cont.addStack()
				wid.Left.Box.QR[i].Cont.Waddinfo.size = new Size(78, 20)
				wid.Left.Box.QR[i].Cont.Waddinfo.layoutHorizontally()
				wid.Left.Box.QR[i].Cont.Waddinfotxt = wid.Left.Box.QR[i].Cont.Waddinfo.addText(wid.V.Waddinfo[i])
				wid.Left.Box.QR[i].Cont.Waddinfotxt.font = new Font("Menlo-Bold", 14)
				wid.Left.Box.QR[i].Cont.Waddinfotxt.textColor = new Color("1c1c1c")
			}//846
		}//833

		//CONT - COUNTDOWN / MAP
		if (wid.V.Days[0] >= 6) {//BOX A COUNTDOWN
			log("BOX A COUNTDOW")
			//VDAYS STACK&TXT
			wid.Left.Box.QR[0].Cont.Days = wid.Left.Box.QR[0].Cont.addStack()
			wid.Left.Box.QR[0].Cont.Days.size = new Size(78, 40)
			wid.Left.Box.QR[0].Cont.Days.layoutHorizontally()
			wid.Left.Box.QR[0].Cont.Days.centerAlignContent()

			wid.Left.Box.QR[0].Cont.Daystxt = wid.Left.Box.QR[0].Cont.Days.addText(String(wid.V.Days[0]))
			wid.Left.Box.QR[0].Cont.Daystxt.font = new Font("Menlo-Bold", 40)
			wid.Left.Box.QR[0].Cont.Daystxt.textColor = new Color("1C1C1C")

			wid.Left.Box.QR[0].Cont.addSpacer(5)

			//"DAY"label STACK&TXT
			wid.Left.Box.QR[0].Cont.DayLable = wid.Left.Box.QR[0].Cont.addStack()
			wid.Left.Box.QR[0].Cont.DayLable.size = new Size(78, 17)
			wid.Left.Box.QR[0].Cont.DayLable.layoutHorizontally()

			wid.Left.Box.QR[0].Cont.DayLabletxt = wid.Left.Box.QR[0].Cont.DayLable.addText("Days")
			wid.Left.Box.QR[0].Cont.DayLabletxt.font = new Font("Menlo-Regular", 13)
			wid.Left.Box.QR[0].Cont.DayLabletxt.textColor = new Color("1c1c1c")

		}
		if (wid.V.Days[1] >= 6) {//BOX B | MAP TRACK LAYOUT
			log("BOX B MAP")
			wid.Left.Box.QR[1].Cont.addSpacer(2)
			//TRACK IMAGE
			wid.Left.Box.QR[1].Cont.Trackimg = wid.Left.Box.QR[1].Cont.addImage(Vtrackimg)
			wid.Left.Box.QR[1].Cont.Trackimg.imageSize = new Size(78, 60)
		}
	}
}
else {
	//RACE INFO
	//RACE TEXT
	wid.Left.Box.Race.Info.Rtxt = wid.Left.Box.Race.Info.addText("R")
	wid.Left.Box.Race.Info.Rtxt.font = Font.boldSystemFont(20)
	wid.Left.Box.Race.Info.Rtxt.textColor = Color.black()

	wid.Left.Box.Race.Info.Racetxt = wid.Left.Box.Race.Info.addText("ace")
	wid.Left.Box.Race.Info.Racetxt.font = Font.italicSystemFont(12)
	wid.Left.Box.Race.Info.Racetxt.textColor = Color.black()

	wid.Left.Box.Race.Info.addSpacer(40)
	//RACE TIME
	wid.Left.Box.Race.Info.Time = wid.Left.Box.Race.Info.addText(String(VtimeUSER[2]))
	wid.Left.Box.Race.Info.Time.font = new Font("Menlo-Bold", 18)
	wid.Left.Box.Race.Info.Time.textColor = new Color("c61a09")

	//WEATHER INFO
	//ICON
	res = await new Request("http://openweathermap.org/img/wn/" + Vweather[2].Code + "@2x.png").loadImage()
	wid.Left.Box.Race.Weather.Img = wid.Left.Box.Race.Weather.addImage(res)
	wid.Left.Box.Race.Weather.Img.imageSize = new Size(45, 45)

	wid.Left.Box.Race.Weather.addSpacer(10)

	//TEXT - TEMP/MM
	wid.Left.Box.Race.Weather.Showtxt = wid.Left.Box.Race.Weather.addText(String(Vweather[2].Show))
	wid.Left.Box.Race.Weather.Showtxt.font = new Font("Menlo-Italic", 12)
	wid.Left.Box.Race.Weather.Showtxt.minimumScaleFactor = 0.2
	wid.Left.Box.Race.Weather.Showtxt.textColor = new Color("1C1C1C")

	// FAST INFO
	// TRACK MAP
	wid.Left.Box.Race.Fast.png = wid.Left.Box.Race.Fast.addImage(Vtrackimg)
	wid.Left.Box.Race.Fast.png.imageSize = new Size(78, 55)
}
//RIGHT(R)-------------------------------STACKS
if (VDays[1] > 7)//WEEKEND INFO - TIME/MAP
{
	log("WIDGET | RIGHT-WEEKINFO")
	//WEEKINFO - STACK
	wid.Right.WeekInfo = wid.Right.addStack()
	wid.Right.WeekInfo.layoutVertically()
	wid.Right.WeekInfo.size = new Size(171, 155)
	//wid.Right.WeekInfo.backgroundColor= Color.red()

	//GP RACENAME
	wid.Right.WeekInfo.RaceName = wid.Right.WeekInfo.addStack()
	wid.Right.WeekInfo.RaceName.layoutHorizontally()
	wid.Right.WeekInfo.RaceName.size = new Size(171, 30)

	//INFO - STACK (LOOP)
	wid.Right.WeekInfo.Info = []
	for (i = 0; i < 3; i++) {//0=FP1,1=QUALI,2=RACE
		//INFO STACK
		log(i)
		wid.Right.WeekInfo.Info[i] = wid.Right.WeekInfo.addStack()
		wid.Right.WeekInfo.Info[i].layoutHorizontally()
		wid.Right.WeekInfo.Info[i].size = new Size(171, 40)
	}
}
else {//TOP10
	wid.Right.Top10 = wid.Right.addStack()
	wid.Right.Top10.size = new Size(171, 155)
	wid.Right.Top10.layoutVertically()

	//TITLE
	wid.Right.Top10.addSpacer(3)

	wid.Right.Top10.Title = wid.Right.Top10.addStack()
	wid.Right.Top10.Title.setPadding(2, 2, 2, 2)
	wid.Right.Top10.Title.size = new Size(171, 18)

	//POSITION
	wid.Right.Top10.addSpacer(3)

	wid.Right.Top10.Pos = wid.Right.Top10.addStack()
	wid.Right.Top10.Pos.size = new Size(171, 132)
	wid.Right.Top10.Pos.addSpacer(1)
}

//E*RIGHT ELEMENTS*---------------------ELEMENTS
//E*RIGHT POS ELEMENTS
if (VDays[1] > 7)//WEEKINFO
{
	log("WIDGET ELEMENT | RIGHT-WEEKINFO")
	//RACENAME
	wid.Right.WeekInfo.RaceName.txt = wid.Right.WeekInfo.RaceName.addText(Vracename)
	wid.Right.WeekInfo.RaceName.txt.minimumScaleFactor = 0.01
	wid.Right.WeekInfo.RaceName.txt.font = Font.boldMonospacedSystemFont(14)
	wid.Right.WeekInfo.RaceName.txt.textColor = Color.red()

	//WORK ON THESE !!!!!
	wid.V = []
	wid.V.space = [], wid.V.session = [], wid.V.day = [], wid.V.month = [], wid.V.sessiontime = [], wid.V.textcolor = []

	wid.V.session[0] = "FP1", wid.V.session[1] = "Quali", wid.V.session[2] = "Race"
	wid.V.space[0] = 5, wid.V.space[1] = 70, wid.V.space[2] = 140
	wid.V.day[0] = Vfp1.dd, wid.V.day[1] = Vdd[1], wid.V.day[2] = Vdd[2]
	wid.V.month[0] = Vfp1.mm, wid.V.month[1] = Vmm[1], wid.V.month[2] = Vmm[2]
	wid.V.sessiontime[0] = Vfp1.timeUSER, wid.V.sessiontime[1] = VtimeUSER[1], wid.V.sessiontime[2] = VtimeUSER[2]

	wid.V.textcolor[0] = Color.white(), wid.V.textcolor[1] = Color.orange(), wid.V.textcolor[2] = Color.red()

	for (i = 0; i < 3; i++) {
		//SPACER
		wid.Right.WeekInfo.Info[i].addSpacer(wid.V.space[i])
		//DATE
		wid.Right.WeekInfo.Info[i].Date = wid.Right.WeekInfo.Info[i].addStack()
		wid.Right.WeekInfo.Info[i].Date.layoutVertically()
		wid.Right.WeekInfo.Info[i].Date.size = new Size(33, 40)

		//DD
		wid.Right.WeekInfo.Info[i].Date.dd = wid.Right.WeekInfo.Info[i].Date.addText(wid.V.day[i])
		wid.Right.WeekInfo.Info[i].Date.dd.font = new Font("Menlo-Bold", 24)
		wid.Right.WeekInfo.Info[i].Date.dd.textColor = wid.V.textcolor[i]

		//MM
		wid.Right.WeekInfo.Info[i].Date.mm = wid.Right.WeekInfo.Info[i].Date.addText(wid.V.month[i])
		wid.Right.WeekInfo.Info[i].Date.mm.font = new Font("Menlo-Regular", 13)

		//DETAILS
		wid.Right.WeekInfo.Info[i].Detail = wid.Right.WeekInfo.Info[i].addStack()
		wid.Right.WeekInfo.Info[i].Detail.layoutVertically()
		wid.Right.WeekInfo.Info[i].Detail.size = new Size(121, 40)


		//SESSION - PRACTICE/QUALI/RACE
		wid.Right.WeekInfo.Info[i].Detail.Sessiontxt = wid.Right.WeekInfo.Info[i].Detail.addText(wid.V.session[i])
		wid.Right.WeekInfo.Info[i].Detail.Sessiontxt.font = new Font("Menlo-Bold", 16)
		wid.Right.WeekInfo.Info[i].Detail.Sessiontxt.textColor = wid.V.textcolor[i]


		//SESSION TIME
		wid.Right.WeekInfo.Info[i].Detail.Sessiontime = wid.Right.WeekInfo.Info[i].Detail.addText(wid.V.sessiontime[i])
		wid.Right.WeekInfo.Info[i].Detail.Sessiontime.font = new Font("Menlo-Regular", 14)

	}
}
else {//TOP 10
	//TO ADD IF TO SELECT RESULT/QUALI/WDC/WCC
	wid.V = []
	wid.V.title = [], wid.V.titlecolor = []

	wid.V.title = "WDC", wid.V.titlecolor = Color.blue()
	wid.V.Posnametext = VWDC

	//TITLE
	//LABLE STACK&TXT
	wid.Right.Top10.Title.Label = wid.Right.Top10.Title.addStack()
	wid.Right.Top10.Title.Label.size = new Size(33, 15)
	wid.Right.Top10.Title.Label.cornerRadius = 2
	wid.Right.Top10.Title.Label.centerAlignContent()
	wid.Right.Top10.Title.Label.setPadding(3, 3, 3, 3)
	wid.Right.Top10.Title.Label.backgroundColor = wid.V.titlecolor

	wid.Right.Top10.Title.Label.txt = wid.Right.Top10.Title.Label.addText(wid.V.title)
	wid.Right.Top10.Title.Label.txt.font = new Font("Menlo-Bold", 14)

	wid.Right.Top10.Title.addSpacer(80)

	//UPDATE TIME TXT
	wid.Right.Top10.Title.Updatetxt = wid.Right.Top10.Title.addText(String(utime))
	wid.Right.Top10.Title.Updatetxt.font = new Font("Menlo-Italics", 12)

	wid.Right.Top10.Pos.Box = [], wid.V.Posnametxt = []

	for (j = 0; j < 2; j++)//2 COLLONM
	{
		//BOX
		wid.Right.Top10.Pos.Box[j] = wid.Right.Top10.Pos.addStack()
		wid.Right.Top10.Pos.Box[j].size = new Size(85, 132)
		wid.Right.Top10.Pos.Box[j].layoutVertically()
		wid.Right.Top10.Pos.Box[j].Tab = []

		if (j == 0) { p = 1 }
		else if (j == 1) {
			p = 2
			wid.Right.Top10.Pos.Box[j].addSpacer(10)
		}

		for (i = 0, p = p; i < 5; i++, p += 2) {
			//TAB
			wid.Right.Top10.Pos.Box[j].Tab[i] = wid.Right.Top10.Pos.Box[j].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].size = new Size(85, 15)

			wid.Right.Top10.Pos.Box[j].addSpacer(10)
			//NO
			wid.Right.Top10.Pos.Box[j].Tab[i].No = wid.Right.Top10.Pos.Box[j].Tab[i].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.size = new Size(15, 15)
			wid.Right.Top10.Pos.Box[j].Tab[i].No.backgroundColor = Color.white()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.conerRadius = 5
			//NOTE MAY CHANGE COLOR TO TEAM COLORS

			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt = wid.Right.Top10.Pos.Box[j].Tab[i].No.addText(String(p))
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.font = new Font("Futura-CondensedExtraBold", 12)
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.textColor = Color.black()
			wid.Right.Top10.Pos.Box[j].Tab[i].No.txt.minimumScaleFactor = 0.1


			//NAME
			wid.Right.Top10.Pos.Box[j].Tab[i].addSpacer(3)

			wid.Right.Top10.Pos.Box[j].Tab[i].Name = wid.Right.Top10.Pos.Box[j].Tab[i].addStack()
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.size = new Size(57, 15)
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.layoutVertically()



			wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt = wid.Right.Top10.Pos.Box[j].Tab[i].Name.addText(wid.V.Posnametext[p].toUpperCase())
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt.minimumScaleFactor = 0.6
			wid.Right.Top10.Pos.Box[j].Tab[i].Name.txt.font = new Font("Futura-CondensedMedium", 17)

		}
	}
}

//SHOW WIDGET
await wid.presentMedium()
Script.setWidget(wid)
