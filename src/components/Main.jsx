import axios from "axios";
import { useState } from "react";
import WeatherCard from "./WeatherCard";

// kontrolsüz component, input verisini normal js gibi submit aninda yakalamaktir. state üzerinden verileri alir ve tutarsak buna kontrollü component denir.
// Bir func icindeki tüm islemler bittikten sonra react state i günceller ve component update edilir. Bu nedenle func icinde console yaparsak en güncel halini alamayiz. En güncel hali icin func disinda yazmaliyiz. Bu birlestirme islemine batching(birlestirme) denir.
// her yerde kullanacagimiz standart bir func varsa bunu nbir component olarak bir yerde tutup import edilebilir
// sifirdan react app i kendimiz yaparsak .env diye paket yüklememiz gerekir. ama biz npx createreactapp kullandigimiz icin .env ekledigimizde sadece yarn start yapmamiz yeterli olacaktir.
// onchange kullanamadan submit butonu ile de input icine girilen veri yakalanabilirdi. onchange kullandigimizda bu kontrollü component olur. mülakatlarda cikabilir.
// kontrollü componentlerde form reset kullanilamaz. cünkü burada state ler dolu 

// inputlardaki value attribute u stateler ile kontrol ediliyor ise kontrollü oluyor.
//  setSearchText("");   bunun calismasi icin value kullanmak gerekir.

const Main = () => {
    const [searchText, setSearchText] = useState()
    const [data, setData] = useState([])
    const [error, setError] = useState("")

    const handleChange = (e) => {
        // console.log(e.target.value);
        setSearchText(e.target.value)
    }
    // console.log(searchText);
    // .env de baslangic REACT_APP seklinde hem büyük hem de bu sekilde olmali.
    // .gitignore a .env i manuel olarak eklemek gerekir.
    // deploy esnasinda .env de bulunan keyleri vercel ve netlify da girmemiz gerekir.
    // get hem axios un hem de fetch in methodudur.
    // filter bütün data yi dolasir.
    // map,  array uzunlugu ne kadar ise ayni uzunlukta yeni bir array olusturr.
    // map filter functional programming in bir parcasidir.
    // bunlar yeni nesil methodlardir ve bunlarda array in taranmasi durdurulamaz sona kadar gider.
    // for loop da break ile durdurma var. 0 dan basla i  su olana kadar git.
    // map de nasil kismi söylenmez. burada bir array var her bir eleman icin sunu yap.
    // declarative imperative(burada naisl kismi söylenmez) programming. 
    // artik developer lar nasil ile ilgilenmesinler
    // functional programming statelere dokunmayin. size emnaet edilen seye dikunmayin diyor 
    // functional programming state d ebir degisiklik yapmak istioyrsan bunun method ile yap diyor direkt elinle yapma diyor.
    // axios tüm hatalari kendi yakalar fetch ise network hatalarini yakalar digerlerini kendimiz yapmamiz gerekir. 

    const handleSubmit = (e) => {
        e.preventDefault();
        searchText ? getWeatherDataFromApi() : alert("Please enter a City")
        // e.target.reset() bu yapi kontrollülerde pek kullanilmaz.
        setSearchText("");
    }

    const getWeatherDataFromApi = async () => {
        let apiKey = process.env.REACT_APP_API_KEY;
        let units = "metric";
        let lang = "tr";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${apiKey}&units=${units}&lang=${lang}`;
        
        try {
            const response = await axios.get(url)
            // console.log(response);
            const {main, name, sys, weather, id} = response.data;
            const iconUrl = `https://openweathermap.org/img/wn/${
            weather[0].icon}@2x.png`; 

            const isExist = data.some((card) => card.id === id)
            if (isExist) {
                setError(`You already know the weather for ${name}, Please search for another city`)
            } else {
                setData([{main, name, sys, weather, iconUrl, id}, ...data ])
            }
            setTimeout(() => {
                setError("")
            }, 3000)
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
      <section className="main">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search for a city" autoFocus onChange={handleChange} value={searchText} />
          <button type="submit">SUBMIT</button>
          <span className="msg">{error} </span>
        </form>
        <div className="container">
          <ul className="cities">
            {
                data && data.map((item) => (
                <WeatherCard item = {item} key={item.id} />))
            }
          </ul>
        </div>
      </section>
    );
  };
  
  export default Main;