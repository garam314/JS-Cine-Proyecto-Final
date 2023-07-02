import * as tjs from './timer.js';

const json_movie_selected = JSON.parse(localStorage.getItem('movieJSON'))
const seats_selected = []

function load_reverse()
{
    let p_title = document.querySelector("#movie-title")
    p_title.textContent = `Reserva - ${json_movie_selected['nombre']}`

    let movie_info = document.querySelector("#div-movie")
    let html_movie = `
    <div id = "movie-information" class="container d-flex mt-5 pt-2 pb-2 bg_movie1 rounded-3">
        <div class="col-4 text-center p-3">
            <img class = "rounded-3" src="${json_movie_selected["url"]}" alt="">
        </div>
        <div class="col-7 m-auto">
            <p>${json_movie_selected["sinopsis"]}</p>
        </div>
    </div>
    `
    movie_info.innerHTML = html_movie
}


function load_seats()
{
    const rows = 6, cols = 25
    let movie_info = document.querySelector("#div-seats")
    for (let i=0;i<=rows;i++)
    {
        let letter = String.fromCharCode(64+i)
        let div_row = document.createElement("div")
        div_row.classList.add("d-flex", "gap-1","justify-content-center")
        div_row.setAttribute("id", "row-"+i)

        // div_row.textContent = i > 0 ? letter: ""
        movie_info.appendChild(div_row)
        let movie_seat_col = document.querySelector("#row-"+i)


        for (let j=0;j<=cols;j++)
        {
            let div = document.createElement("div")
            let p = document.createElement("p")

            //LA PRIMERA FILA CORRESPONDE A LOS INDICES DE LAS COLUMNAS
            if (i==0)
            {
                if(j==0) //EL INDICE 0,0 NO LLEVA NADA
                {
                    div.classList.add("col-1", "header_seats")
                    div.textContent = ""
                    movie_seat_col.append(div)
                }
                else
                {
                    div.classList.add("col-1", "header_seats")
                    p.textContent = j
                    div.appendChild(p)
                    movie_seat_col.append(div)
                }
            }
            else
            {
                if (j > 0)
                {
                    div.setAttribute("id", letter + j)
                    div.setAttribute("selected", "0")
                    div.classList.add("col-1", "bg_seat_icon", "detach")
                    p.classList.add("font_seats", "h-100")
                    p.textContent = letter + j
                    div.appendChild(p)
                    div.addEventListener("click", select_seat)
                    movie_seat_col.append(div)
                }
                else
                {
                    div.classList.add("col-1", "header_seats")
                    p.textContent = letter
                    div.appendChild(p)
                    movie_seat_col.append(div)
                }
            }
        }
    
    }

    
}

function show_toasty(opcion, text)
{

    Toastify({
        text: `${text} Seleccionado`,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #38B000, #96c93d)",
        }
    }).showToast();
}

function select_seat(event)
{
    let seat = event.target.textContent
    let div = event.target.parentNode
    let ind = div.getAttribute("selected")
    if (ind === null) return
    if (ind == 0)
    {
        div.classList.remove("bg_seat_icon")
        div.classList.add("bg_seat_selected_icon")
        div.setAttribute("selected", 1)

        seats_selected.push(seat)
        show_toasty(1, seat)
    }
    else
    {
        div.classList.remove("bg_seat_selected_icon")
        div.classList.add("bg_seat_icon")
        div.setAttribute("selected", 0)

        let index = seats_selected.indexOf(seat)
        if (index !== -1)
        {
            seats_selected.splice(index, 1)
        }
    }

    let show_seat = document.querySelector("#seat-selected")

    show_seat.innerHTML = `<p class = "font_information">${seats_selected.length > 0 ? "Asientos: ": ""}${seats_selected.join(" - ")}</p>`
    
}

function continue_reservation()
{

    if(seats_selected.length == 0)
    {
        Swal.fire(
            'Reserva',
            'Seleccione Al Menos Un Asiento Para Continuar',
            'info'
          )
        return
    }

    let json = JSON.stringify(seats_selected)
    localStorage.setItem('seatsJSON', json);
    window.location.href = "./combos.html"
}


function load_page()
{
    load_reverse()
    load_seats()
    let button = document.querySelector("#b-continue")
    button.addEventListener("click", continue_reservation)

    tjs.validate_timer()

    if (localStorage.getItem('seatsJSON') !== null)
    {
        let tickets = JSON.parse(localStorage.getItem('seatsJSON'))
        tickets.forEach(ticket=>{
            let save_seat = document.querySelector(`#${ticket}`)
            save_seat.classList.remove("bg_seat_icon")
            save_seat.classList.add("bg_seat_selected_icon")
            save_seat.setAttribute("selected", "1")
            seats_selected.push(ticket)
        })
    }

}

document.addEventListener("DOMContentLoaded", load_page())