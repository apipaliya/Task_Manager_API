
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('.message-1')
const messageSecond = document.querySelector('.message-2')
const icon = document.querySelector('.icon')
const bd = document.querySelector('body')
const realfeel = document.querySelector('.realfeel')
const humidity = document.querySelector('.humidity')
const container = document.querySelector('.container')
const pressure = document.querySelector('.pressure')
const uvindex = document.querySelector('.uvindex')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = search.value;
    messageOne.textContent = 'Loading...'
    messageSecond.textContent = ''
    icon.alt='Loading icon...'
    icon.src=''
    fetch('/weather?address=' + location).then((res) => {
        res.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                icon.alt=''
                icon.src=''
            }
            else {
                messageOne.textContent = data.location
                messageSecond.textContent = data.forcast
                console.log("imag data here")
                console.log(data.icon)
                icon.src = data.icon
                realfeel.innerHTML = data.extraInfo.feelslike
                humidity.innerHTML = data.extraInfo.humidity+"%"
                pressure.innerHTML = data.extraInfo.pressure+"mbar"
                uvindex.innerHTML = data.extraInfo.uv_index
            }
        })
    })
})