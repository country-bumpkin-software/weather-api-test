require("dotenv").config();
const request = require("supertest");
const baseUrl = "https://api.openweathermap.org/data/3.0";

describe("My Weather Forecast", () => {
  it("can get the weather for next 8 days", async () => {
    const res = await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: `-94.04`})
        .query({exclude: "minutely,hourly"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(200);
    expect(res.body.daily).toHaveLength(8)
  });

  it("returns correct status code for missing latitude", async () => {
    await request(baseUrl)
        .get("/onecall")
        .query({lat: ''})
        .query({lon: `-94.04`})
        .query({exclude: "minutely,hourly"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(400);
  });

  it("returns correct status code for missing longitude", async () => {
    await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: ``})
        .query({exclude: "minutely,hourly"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(400);
  });
  
  it("returns correct status code for missing API key", async () => {
    await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: `-94.04`})
        .query({exclude: "minutely,hourly"})
        .set("Accept", "application/json")
        .expect(401);
  });

  it("returns minutely data", async () => {
    const res = await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: `-94.04`})
        .query({exclude: "daily,hourly"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(200);
    expect(res.body.minutely).toHaveLength(61)

  });
  it("returns hourly data", async () => {
    const res = await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: `-94.04`})
        .query({exclude: "daily,minutely"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(200);

    expect(res.body.hourly).toHaveLength(48)
  });

  it("correct weather data - daily", async () => {
    const res = await request(baseUrl)
        .get("/onecall")
        .query({lat: '33.01'})
        .query({lon: `-94.04`})
        .query({exclude: "hourly,minutely"})
        .query({appid:  `${process.env.WEATHER_API_KEY}`})    
        .set("Accept", "application/json")
        .expect(200);
    let got = res.body    
    let want = {
            lat: 33.01,
            lon: -94.04,
            timezone: 'America/Chicago',
            timezone_offset: -18000,
            current: expect.anything(),
            daily: 
             expect.anything()
          }
    expect(got).toMatchObject(want)
  });

});
