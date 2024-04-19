import { Router, AddChildren, AddElement, AddProp, GetElementById, DOMid } from "./framework/main.js"

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
        if (elemList[i].children[0].children[1].props.className = "todo-label stripped") {
            elemList[i].children[0].children[1].style = "display:none;"
        } else {
            elemList[i].children[0].children[1].style = "display:inline-block;"
        }
    }
    AddChildren("thisisul", elemList, virtualDOM)
    router.navigate("/active")
}

function completed() {
    for (let i in elemList) {
        if (elemList[i].children[0].children[1].props.className = "todo-label stripped") {
            elemList[i].children[0].children[1].style = "display:inline-block;"
        } else {
            elemList[i].children[0].children[1].style = "display:none;"
        }
    }
    AddChildren("thisisul", elemList, virtualDOM)
    router.navigate("/completed")
}

function handleAllChecked() {
    let elem = GetElementById(virtualDOM, "all-checkbox")
    elem.props["checked"] = !elem.props["checked"]
    console.log(virtualDOM)
    if (countUnstriked() === 0) {
        for (let i in elemList) {
            elemList[i].children[0].children[1].props.className = "todo-label"
        }
    } else {
        for (let i in elemList) {
            elemList[i].children[0].children[1].props.className = "todo-label stripped"
        }
    }
    
    AddChildren("thisisul", elemList, virtualDOM)
    router.render({component: {render: virtualDOM}})
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
                    props: {type: "checkbox", className: "checkboxes"},
                    children: []
                },
                {
                    tag: "label",
                    props: {className: "todo-label", id: "label"+count, ondblclick: (e) => {editLabel(e.target)}},
                    children: [event.target.querySelector('input[type="text"]').value]
                },
                {
                    tag: "input",
                    props: {id: "editField"+count, style: "display:none;", onblur: (e) => {saveLabel(e.target)}},
                    children: []
                },
                {
                    tag: "button",
                    props: {onclick: () => {completed()}, style: "float:right;"},
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

function editLabel(label) {
    let labelText = label.innerText
    let editField = DOMid("editField"+label.id[label.id.length-1])
    editField.style.display = "inline-block"
    editField.value = labelText
    label.style.display = "none"
    editField.focus()
}

function saveLabel(input) {
    let label = DOMid(input.previousSibling.id)
    let editedText = input.value
    label.innerText = editedText
    input.style.display = "none"
    label.style.display = "inline-block"
}

function countUnstriked() {
    let unstrikedCount = 0
    for (let i in elemList) {
        if (elemList[i].children[0].children[1].props.className === "todo-label") {
            unstrikedCount++
        }
    }
    return unstrikedCount
}

const router = new Router(routes)

router.navigate(window.location.pathname)
