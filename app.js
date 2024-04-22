import { Router, AddChildren, AddElement, AddProp, GetElementById} from "./framework/main.js"

var elemList = []

var count = 0

var footerComponent = {
    tag: "footer",
    props: { id: "foot"},
    children: [
        { tag: "span", props: {id: "items-left"}, children: [] },
        {
            tag: "ul",
            props: {id: "ul-footer"},
            children: [
                { tag: "li", props: null, children: [
					{ tag: "button", props: {onclick: () => {all()}}, children: ["All"]}
				]},
				{ tag: "li", props: null, children: [
					{ tag: "button", props: {onclick: () => {active()}}, children: ["Active"]}
				]},
                { tag: "li", props: null, children: [
					{ tag: "button", props: {onclick: () => {completed()}}, children: ["Completed"]}
				]}
            ]
        },
        {tag: "button", props: {onclick: () => {all()}}, children: ["Clear completed"]}
    ]
}

var virtualDOM = {
    tag: "div",
    props: { id: "main-container" },
    children: [
        { tag: "h1", props: null, children: ["todos"] },
        {
            tag: "section",
            props: {id: "root"},
            children: [
                { tag: "header", props: {id: "app-header"}, children: [
                    {
                        tag: "input",
                        props: {
                            id: "all-checkbox",
                            className: "checkboxes",
                            type: "checkbox",
                            style:"display:none;",
                            onchange: handleAllChecked
                        },
                        children: []
                    },
					{
                        tag: "form",
                        props: {
                            style: "width:100%;",
                            onsubmit: handleSubmit
                        },
                        children: [{
                            tag: "input",
                            props: {
                                type: "text",
                                id: "todo-input-text",
                                placeholder: "What needs to be done?"
                            },
                            children: []
                        }]
					}
				]},
				{ tag: "main", props: null, children: [
					{
						tag: "ul",
						props: {id: "thisisul"},
						children: []
					}
				]}
            ]
        }
    ]
}

const routes = [
    {
        path: "/",
        component: {
            render: virtualDOM,
        }
    },
    {
        path: "/active",
        component: {
            render: virtualDOM,
        }
    },
    {
        path: "/completed",
        component: {
        	render: virtualDOM,
        }
    }
]

function all() {
    for (let i in elemList) {
        elemList[i].children[0].children[1].style = "display:inline-block;"
    }
    AddChildren("thisisul", elemList, virtualDOM)
    router.navigate("/")
}

function active() {
    for (let i in elemList) {
        if (elemList[i].children[0].children[1].children[0].props.className = "todo-label stripped") {
            elemList[i].style = "display:none;"
        } else {
            elemList[i].style = "display:inline-block;"
        }
    }
    AddChildren("thisisul", elemList, virtualDOM)
    router.navigate("/active")
}

function completed() {
    for (let i in elemList) {
        if (elemList[i].children[0].children[1].children[0].props.className = "todo-label stripped") {
            elemList[i].style = "display:inline-block;"
        } else {
            elemList[i].style = "display:none;"
        }
    }
    AddChildren("thisisul", elemList, virtualDOM)
    router.navigate("/completed")
}

function handleAllChecked() {
    let elem = GetElementById(virtualDOM, "all-checkbox")
    elem.props["checked"] = !elem.props["checked"]
    if (countUnstriked() === 0) {
        count = elemList.length
        for (let i in elemList) {
            elemList[i].children[0].children[1].children[0].props.className = "todo-label"
            elemList[i].children[0].children[0].props.checked = false
        }
    } else {
        count = 0
        for (let i in elemList) {
            elemList[i].children[0].children[1].children[0].props.className = "todo-label stripped"
            elemList[i].children[0].children[0].props.checked = true
        }
    }
    
    AddChildren("thisisul", elemList, virtualDOM)

    let unstriked = countUnstriked()
    AddChildren("items-left", [unstriked + " item(s) left!"], virtualDOM)

    router.render({component: {render: virtualDOM}})
}

function handleChecked(e) {
    let id = e.target.id.substring(8) 
    let elem = GetElementById(virtualDOM, e.target.id)
    elem.props["checked"] = !elem.props["checked"]

    let text = GetElementById(virtualDOM, "label"+id)
    if (elem.props["checked"]) {  
        text.props.className = "todo-label stripped"
    } else {
        text.props.className = "todo-label"
    }

    let unstriked = countUnstriked()
    AddChildren("items-left", [unstriked + " item(s) left!"], virtualDOM)

    console.log(unstriked, elemList.length)
    //change the master checkbox if needed
    if (unstriked > 0) {
        AddProp("all-checkbox", {checked:false}, virtualDOM)
    } else {
        AddProp("all-checkbox", {checked:true}, virtualDOM)
    }

    //redirect so I can check which li to show
    if (window.location.pathname === "/") {
        all()
    } else if (window.location.pathname === "/active") {
        active()
    } else {
        completed()
    }
}

function handleSubmit(event) {
    event.preventDefault()

    //add element to list
    count++
    elemList.push(
        { tag: "li", props: {id: "li" + count}, children: [
            {tag: "div", props: {className: "labels-parent"}, children: [
                {
                    tag: "input",
                    props: {type: "checkbox", id: "checkbox"+count, className: "checkboxes", onchange: handleChecked},
                    children: []
                },
                {
                    tag: "form",
                    props: {onsubmit: handleLabelSubmit, className: "li-forms"},
                    children: [
                        {
                            tag: "label",
                            props: {className: "todo-label", id: "label"+count, ondblclick: (e) => {editLabel(e.target)}},
                            children: [event.target.querySelector('input[type="text"]').value]
                        },
                        {
                            tag: "input",
                        props: {type: "text", id: "editField"+count, style: "display:none;", /*onblur: (e) => {saveLabel(e.target)} remove display*/},
                            children: []
                        }
                    ]
                },
                {
                    tag: "button",
                    props: {onclick: () => {completed()}, className: "delete-button"},
                    children: ["delete"]
                }
            ]}
        ]}
    )
    AddChildren("thisisul", elemList, virtualDOM)

    //check if footer exist and add it if not
    if (!GetElementById(virtualDOM, "foot")) {
        AddElement("root", footerComponent, virtualDOM)
    }

    //show the check all
    AddProp("all-checkbox", {style:"inline-block;"}, virtualDOM)

    let unstriked = countUnstriked()
    AddChildren("items-left", [unstriked + " item(s) left!"], virtualDOM)
    router.render({component: {render: virtualDOM}})
}

function handleLabelSubmit(e) {
    e.preventDefault()
    let inputReturn = e.target.querySelector('input[type="text"]')
    let idToFind = "label" + inputReturn.id.substring(9)
    AddChildren(idToFind, [inputReturn.value] , virtualDOM)
    AddProp(idToFind, {style:"display:inline-block;"}, virtualDOM)
    AddProp(inputReturn.id, {style:"display:none;"}, virtualDOM)
    router.render({component: {render: virtualDOM}})
}

function editLabel(label) {

    AddProp(label.id, {style:"display:none;"}, virtualDOM)
    
    let idToFind = "editField" + label.id.substring(5)

    AddProp(idToFind, {style:"display:inline-block;", value:label.innerText}, virtualDOM)
    //AddChildren(idToFind, [label.innerText] , virtualDOM)
    router.render({component: {render: virtualDOM}})

    let editField = DOMid(idToFind)
    editField.focus()
}

function countUnstriked() {
    let unstrikedCount = 0
    for (let i in elemList) {
        if (elemList[i].children[0].children[1].children[0].props.className === "todo-label") {
            unstrikedCount++
        }
    }
    return unstrikedCount
}

const router = new Router(routes)

router.navigate(window.location.pathname)
