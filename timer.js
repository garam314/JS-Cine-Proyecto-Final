let timer
let contador = document.querySelector("#toast-text")
contador.classList.add("h4", "fw-bold", "text-center")
export function f_time_out()
{

    let color_alert = document.querySelector("#logo-toast")
    let minutes = Math.floor(timer/60)
    let segundos = timer%60
    let time = `${minutes<10 ? '0'+minutes : minutes}:${segundos<10 ? '0'+segundos : segundos}`
    contador.textContent = time
    if (timer > 0)
    {
        timer--
        localStorage.setItem('timer', timer);
        switch (true) {
            case (timer > 180):
                color_alert.setAttribute("src", "./images/icons/green_color.png")
                break;
            case (timer > 60 && timer < 180):
                color_alert.setAttribute("src", "./images/icons/orange_color.png")
                break;
            case (timer < 60):
                color_alert.setAttribute("src", "./images/icons/red_color.png")
                break;
        }

        setTimeout(f_time_out, 1000);
    }
    else
    {  

        Swal.fire({
            title: 'Tiempo Agotado ',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          })



        setTimeout(()=>{
            localStorage.removeItem('timer')
            localStorage.removeItem('seatsJSON')
            localStorage.removeItem('movieJSON')
            localStorage.removeItem('packs')
            timer = 0
            window.location.href = "./index.html"
        }, 2000)
    }
    


}
let temporizador = setTimeout(f_time_out, timer);
clearTimeout(temporizador);



export function show_toast()
{
    let toast = new bootstrap.Toast(document.querySelector("#toast"));
    toast.show();
}

export function validate_timer(indicador)
{
    if (localStorage.getItem('timer') !== null)
    {
        timer = localStorage.getItem('timer')
        f_time_out()
        show_toast()
    }
}


export function f_timer()
{
    if (localStorage.getItem('timer') !== null)
    {
        timer = localStorage.getItem('timer')
        f_time_out()
        show_toast()
    }
    else
    {
        timer = 300 //TIEMPO DE SESION

        Swal.fire(
            'Atención',
            'Recuerde que dispone de 5 minutos para finalizar su compra',
            'warning'
          ).then((result) => {
            f_time_out()
            show_toast()
          });
    }
}
