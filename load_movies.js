import * as tjs from './timer.js';


let movie_filtered_name = []
let movies = []
let movies_json = []

fetch('./movies.json')
.then(respose => respose.json())
.then(data=>{load_movies(data)})


tjs.validate_timer()

function load_movies(json)
{
    let html = ''
    let color
    const div = document.querySelector("#movies")
    json.forEach((movie, index) => {
        if (index%2 === 0)
            color = "bg_movie1"
        else
            color = "bg_movie2"


        html += `
        <div class="d-block mt-5 mb-5 ${color} d-flex p-3 gap-5" data-movie-div name-movie = "${movie["nombre"]}" category-movie ="${movie["categoria"]}" filtered = 1>
            <div>
              <img src="${movie["url"]}"" alt="" class="rounded-3">
            </div>
            <div class="d-flex row gap-3 align-content-start">
                <div class="col-lg-12">
                    <h2 id = "movie_name">${movie["nombre"]}</h2>
                </div>
                <div>
                    <p>${movie["sinopsis"]}</p>
                </div>
                <div>
                    <p>Categoria: ${movie["categoria"]}</p>
                </div>
                <div class = "d-flex">
                ${movie.funciones.map(e=>
                    `<div class = "col-2">
                        <button id = "${index}" type="button" class="btn btn-light" data-funcion>${e}</button>
                    </div>`                    
                ).join('')}
                </div>
            </div>
        </div>
        `
        movies_json.push(movie)
    });
    div.innerHTML = html
    movies = document.querySelectorAll("[data-movie-div]")
    const filter_funcion = document.querySelectorAll("[data-funcion]")

    filter_funcion.forEach(boton=>{
       boton.addEventListener('click', reserve_movie)
    })
}


const filter = document.querySelector("#filter-movie")
filter.addEventListener("input", filter_name)

function filter_name()
{
    const movie_name_input = filter.value.toLocaleLowerCase()  
    const div_not_find = document.querySelector("#not-find")
    let find = false
    movie_filtered_name = []

    movies.forEach(movie=>{
        let movie_mane = movie.getAttribute("name-movie").toLocaleLowerCase()

        let bool_name = movie_mane.includes(movie_name_input)

        if (bool_name)
        {
            movie.classList.add("d-block")
            movie.classList.remove("d-none")
            find = true
        }
        else
        {
            movie.classList.add("d-none")
            movie.classList.remove("d-block")
        }
    })

    if (!find)
    {
        div_not_find.classList.remove("d-none")
        div_not_find.classList.add("d-block")
    }
    else
    {
        div_not_find.classList.remove("d-block")
        div_not_find.classList.add("d-none")
    }
}

function reserve_movie(event)
{

    let id_movie = event.target.id
    let funcion = event.target.innerHTML

    movies_json[id_movie].funciones = funcion
    movies_json[id_movie].id = id_movie

    let json = JSON.stringify(movies_json[id_movie]);

    if (localStorage.getItem("timer") !== null)
    {
        Swal.fire({
            title: '¿Desea continuar?',
            text: 'Usted tiene una reserva previa, si continua la perdera',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Continuar',
            cancelButtonText: 'No, Regresar a mi Reserva',
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = "./combos.html"
            }
            else if (result.isConfirmed)
            {
                localStorage.removeItem('timer')
                localStorage.removeItem('seatsJSON')
                localStorage.removeItem('movieJSON')
                localStorage.removeItem('packs')

                localStorage.setItem('movieJSON', json);
                window.location.href = "./reserva.html"
            }
          });
    }
    else
    {
        
        localStorage.setItem('movieJSON', json);
        window.location.href = "./reserva.html"
    }
}