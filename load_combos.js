

import * as tjs from './timer.js';


let jsonData//COMBOS
let current_page
let minPage
let maxPage
let first_load = true
let modal

let added_pack = new Map()//COMBOS SELECIONADOS
let tickets//ENTRADAS ASIENTOS
let movie//PELICULA ELEGIDA

function get_info_combo(id_pack)
{
    return jsonData.find(item => item.id === id_pack)
}


function load_page()
{
    
    fetch('./pack_pop_corn.json')
    .then(respose => respose.json())
    .then(data=>{
        jsonData = data
        minPage = data.reduce((min, data) => Math.min(min, data.pagina), +Infinity);
        maxPage = data.reduce((max, data) => Math.max(max, data.pagina), -Infinity);
        current_page = minPage
        load_combos(jsonData, current_page)

        tickets = JSON.parse(localStorage.getItem('seatsJSON'))
        movie = JSON.parse(localStorage.getItem('movieJSON'))
    
        const div_movie_name = document.querySelector("#details-movie")
        const div_movie_info = document.querySelector("#details-buy-ticket")
    
    
        let html = `
        <div class="col-12 bg_standar2 text-white rounded-2 pt-2 pb-2">
            <p class="m-0">${movie['nombre']}, Función: ${movie['funciones']}</p>
        </div>
        `
    
        div_movie_name.innerHTML = html
    
    
    
    
        html = `
        <div class="row justify-content-between p-2 gap-2">`
    
    
        tickets.forEach(ticket=>{
            html +=  `
            <div class="p-0 col-3 text-center">
                <p class="m-0">Ticket</p>
            </div>
            <div class="d-flex gap-2 col-8 flex-wrap p-0 justify-content-around ">
                <div class="col-2 p-0 text-center">
                    <p class="m-0">${ticket}</p>
                </div>
                <div class="col-5 p-0 text-center">
                    <p class="m-0">$ ${movie['valor']}</p>
                </div>
            </div>
            `
        })
    
        html += `
        </div>
        `
        div_movie_info.innerHTML = html
    
        const b_pay = document.querySelector("#send-data")
        b_pay.addEventListener("click", submitForm)
        modal = new bootstrap.Modal(document.querySelector("#myModal"));
    
        load_pack()
        draw_pack()
        calculate_total()
    })   
    tjs.f_timer()
}

function change_page(event)
{
    let id = event.target.id
    
    if (event.target.id === "next")
    {
        current_page++
    }
    else if (event.target.id === "prev")
    {
        current_page--
    }

    load_combos(jsonData, current_page)
    let page = document.querySelector(`#${id}`)
    if (!(current_page > minPage && current_page < maxPage))
    {
        page.classList.add("d-none")
        page.classList.remove("d-block")
    }
    else
    {
        page.classList.add("d-block")
        page.classList.remove("d-none")
    }
}



function load_combos(json, page)
{
    

    const div_details_pack = document.querySelector("#details-pack")
    div_details_pack.innerHTML = ""

    json.forEach(combo => {

        if (combo['pagina'] === page)
        {

            const div_pack = document.createElement("div")
            div_pack.classList.add("row", "gap-2", "justify-content-around", "mt-3", "mb-3")

            const div_image = document.createElement("div")
            div_image.classList.add("col-4", "text-center")

            const image_pack = document.createElement("img")
            image_pack.classList.add("p-3", "rounded-5", "w-100")
            image_pack.setAttribute("src", combo['url'])

            const div_description_pack = document.createElement("div")
            div_description_pack.classList.add("col-7", "p-3")

            const h4 = document.createElement("h4")
            h4.textContent = combo['nombre']

            const p = document.createElement("p")
            p.textContent = combo['descripcion']

            const hr = document.createElement("hr")

            div_description_pack.appendChild(h4)
            div_description_pack.appendChild(p)
            div_description_pack.appendChild(hr)

            combo['detalle'].forEach(item =>{

                const li = document.createElement("li")
                li.textContent = item
                div_description_pack.appendChild(li)
            })
            div_description_pack.appendChild(hr.cloneNode())
            const h3 = document.createElement("h3")
            h3.textContent = `$ ${combo['valor']}`

            const button = document.createElement("button")
            button.classList.add("btn", "btn-primary")
            button.textContent = "Agregar"
            button.setAttribute("id", combo['id'])
            button.addEventListener("click", add_pack)

            div_description_pack.appendChild(h3)
            div_description_pack.appendChild(button)


            

            div_image.appendChild(image_pack)
            div_pack.appendChild(div_image)
            div_pack.appendChild(div_description_pack)

            div_details_pack.appendChild(div_pack)
        }

    });

    const div_page = document.createElement("div")
    div_page.classList.add("d-flex", "gap-3", "justify-content-center", "text-center", "mb-4")

    for(let i=1;i<=3;i++){
        const div_number_page = document.createElement("div")
        const a = document.createElement("a")
        
        const p = document.createElement("p")

        a.setAttribute("href", "#")
        a.addEventListener("click", change_page)
        if(i==1){
            if (first_load)
            {
                a.classList.add("d-none")
                first_load = false
            }
            a.setAttribute("id", "prev")
            a.textContent = "<<"

            div_number_page.appendChild(a)
        }
        else if(i==2)
        {
            p.textContent = page
            div_number_page.appendChild(p)
        }
        else
        {
            a.setAttribute("id", "next")
            a.textContent = ">>"

            div_number_page.appendChild(a)
        }

        
        div_page.appendChild(div_number_page)
    }

    div_details_pack.appendChild(div_page)
}


function draw_pack()
{
    const div_detail = document.querySelector("#details-buy")

    let html = ''

    added_pack.forEach((pack, id) =>{

        const pack_data = get_info_combo(id)


        html += `
        <hr>
        <div class="col-6 mb-1">
            <p class="m-0">${pack_data['nombre']}</p>
        </div>
        <div class="col-1 p-0 text-center mb-1">
            <p class="m-0">${pack}</p>
        </div>
        <div class="col-2 p-0 text-center mb-1">
            <p class="m-0">$ ${pack_data['valor']}</p>
        </div>
        <div class="col-1 p-0 text-center mb-1">
            <button class="btn btn-warning ps-2 pe-2 fw-bold" data-del-button data-pack = "${pack_data['id']}">-</button>
        </div>
        <hr>
        `

    })

    div_detail.innerHTML = html

    const del_buttons = document.querySelectorAll('[data-del-button]')

    del_buttons.forEach(button =>{
        button.addEventListener("click", del_pack)
    })
}

function add_pack(event)
{
    const id_combo = event.target.id
    
    if (added_pack.has(id_combo))
    {
        let val = added_pack.get(id_combo)
        val++
        added_pack.set(id_combo, val)
    }
    else
    {
        added_pack.set(id_combo, 1)
    }
    let mapJSON = JSON.stringify([...added_pack]);
    localStorage.setItem('packs', mapJSON);


    let name_pack = get_info_combo(id_combo)
    show_toasty(1, name_pack['nombre'])

    draw_pack()
    calculate_total()
}


function del_pack(event)
{
    const id = event.target.dataset.pack
    added_pack.get(id)
    let quantity = added_pack.get(id)

    quantity--
    if (quantity>0)
    {
        added_pack.set(id, quantity)
    }
    else
    {
        added_pack.delete(id)
    }

    let mapJSON = JSON.stringify([...added_pack]);
    localStorage.setItem('packs', mapJSON);
    show_toasty(2, "Combo Quitado")

    draw_pack()
    calculate_total()

}

function calculate_total()
{
    
    const div_total = document.querySelector("#total-buy")
    div_total.innerHTML = ""

    let total_pack = 0
    added_pack.forEach((combo, id) =>{
        const pack_data = get_info_combo(id)
        total_pack += pack_data['valor']*combo
    })
    let total_tickets = tickets.length*movie['valor']

    let total = total_pack + total_tickets

    const p = document.createElement("p")
    p.classList.add("m-0", "fw-bold")
    p.textContent = `TOTAL: ${total}`
    div_total.appendChild(p)

}


function submitForm() {
    // Obtener los valores del formulario
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    
    // Validar que los campos sean obligatorios
    if (!name || !email) {
        Swal.fire("Por favor, complete todos los campos obligatorios.")
        return
    }
    
    // Validar el formato del correo electrónico utilizando una expresión regular
    let emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        Swal.fire("Por favor, ingrese un correo electrónico válido.")
      return
    }


    Swal.fire({
        title: '¿Quieres Confirmar Tu Compra?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Felicidades!', 'Tu Reserva Fue Exitosa', 'success')
          modal.hide()
          setTimeout(function(){
            localStorage.removeItem('timer')
            localStorage.removeItem('seatsJSON')
            localStorage.removeItem('movieJSON')
            localStorage.removeItem('packs')
            window.location.href = "./index.html"
          }, 2000   )
        } 
      })
    

  }


function show_toasty(opcion, text)
{
    let background

    switch (opcion) {
        case 1:
            background = "linear-gradient(to right, #38B000, #96c93d)"
            break;
    
        case 2:
            background = "linear-gradient(to right, #4c0b14, #991628)"
            break;
    }

    Toastify({
        text: `${text}`,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: background,
        }
    }).showToast();
}

function load_pack()
{
    if (localStorage.getItem('packs') !== null)
    {
        let pack_array = JSON.parse(localStorage.getItem('packs'))
        let pack_map = new Map(pack_array)
        added_pack = pack_map
        
    }

    
}

document.addEventListener("DOMContentLoaded", load_page())

