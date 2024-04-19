export class Router {
    constructor(routes) {
      	this.routes = routes
    }
  
    navigate(path) {
		const route = this.routes.find(route => route.path === path)
		if (route) {
			history.pushState({ path }, "", path)
			this.render(route)
		} else {
			console.error("Route not found")
		}
    }
  
    render(route) {
		const { component } = route
		// if (component.reset) {
		// 	resetDom(component.reset, component.render)
		// }
		document.body.innerHTML = ""

		const realDOM = createRealElement(component.render)
		document.body.appendChild(realDOM)
    }
}

//is used?
// function resetDom(virtualDOM, idList) {
// 	for (let i in idList) {
// 		GetElementById(virtualDOM, idList[i])
// 	}
// }

export function AddProp(path, newProp, virtualDOM) {
	const childrenToProp = GetElementById(virtualDOM, path)
	if (childrenToProp) {
		for (const key in newProp) {
			childrenToProp.props[key] = newProp[key]
		}
		const realDOM = createRealElement(virtualDOM)
		document.body.appendChild(realDOM)
	} else {
		console.log("Element not found.")
	}
}

export function AddChildren(path, newElement, virtualDOM) {
	const childrenToCreate = GetElementById(virtualDOM, path)
	if (childrenToCreate) {
		childrenToCreate.children = newElement
		const realDOM = createRealElement(virtualDOM)
		document.body.appendChild(realDOM)
	} else {
		console.log("Element not found.")
	}
}

export function AddElement(path, newElement, virtualDOM) {
	const childrenToModify = GetElementById(virtualDOM, path)
	if (childrenToModify) {
		childrenToModify.children.push(newElement)
		const realDOM = createRealElement(virtualDOM)
		document.body.appendChild(realDOM)
	} else {
		console.log("Element not found.")
	}
}

export function GetElementById(node, id) {
	if (node.props && node.props.id === id) {
	  	return node
	}
	if (node.children) {
		for (const child of node.children) {
			const found = GetElementById(child, id)
			if (found) {
				return found
			}
		}
	}
	return null
}

export function DOMid(id) {
	return document.getElementById(id)
}

//not used yet
// export function getElementByClass(node, elemClass) {
// 	if (node.props && node.props.class === elemClass) {
// 	  	return node
// 	}
  
// 	if (node.children) {
// 		for (const child of node.children) {
// 			const found = getElementById(child, elemClass)
// 			if (found) {
// 				return found;
// 			}
// 		}
// 	}
  
// 	return null;
// }

function createRealElement(virtualNode) {
    if (typeof virtualNode === "string") {
        return document.createTextNode(virtualNode)
    }

    const element = document.createElement(virtualNode.tag)

    if (virtualNode.props) {
        Object.keys(virtualNode.props).forEach(propName => {
        	element[propName] = virtualNode.props[propName]
        });
    }

    virtualNode.children.forEach(child => {
		if (child) {
			element.appendChild(createRealElement(child))
		}
    })

    return element
}
