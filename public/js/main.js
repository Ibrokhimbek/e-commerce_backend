window.addEventListener('load', () => {
    let saleing = document.querySelectorAll('.saleing')
    let sale_price = document.querySelectorAll('.sale_price')

    saleing.forEach((element, index) => {
        if(element.innerHTML == "") {
            element.style.display = 'none'
            sale_price[index].style.display = 'none'
        }
    })

    let cardIn = document.querySelectorAll('.product_img')
    cardIn.forEach(element=>{
        element.addEventListener('click', ()=> {
            let id = element.getAttribute('cardId')
            window.location.href = id
        })
    })
})