
function pollContactsHeader() {
    let root_el = ""
    try {
        root_el = document.querySelector("[aria-label=\"Thread list\"]").childNodes[0].childNodes[0].childNodes[0].childNodes[1] 
    } catch (error) {
        setTimeout(pollContactsHeader, 100)
        return
    }
    root_el.style.flexDirection = 'row'
    root_el.style.alignItems = 'center'
    let ui_el = document.createElement("div")
    ui_el.classList.add("x78zum5", "x2lah0s")
    ui_el.innerHTML = "<button type=\"button\" id=\"set_compact_btn\">Compact</button>\
        <button type=\"button\" id=\"reload_btn\">Normal</button>"
    root_el.insertBefore(ui_el, root_el.children[0])
    window.compactMode.get().then(response => {
        if (response == true) {
            document.querySelector("#set_compact_btn").classList.toggle("hidden")
        } else {
            document.querySelector("#reload_btn").classList.toggle("hidden")
        }
    })
    document.querySelector("#set_compact_btn").addEventListener('click', function (e) {
        document.querySelector("#reload_btn").classList.toggle("hidden")
        document.querySelector("#set_compact_btn").classList.toggle("hidden")
        window.compactMode.enable()
    })
    document.querySelector("#reload_btn").addEventListener('click', function (e) {
        document.querySelector("#reload_btn").classList.toggle("hidden")
        document.querySelector("#set_compact_btn").classList.toggle("hidden")
        window.compactMode.disable()
    })
    console.log("UI hooked")
}

pollContactsHeader()