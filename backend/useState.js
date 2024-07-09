const values = []
let valueIndex = 0
let valueOffset = 0
let frozenOffset = +Infinity

function TestComponent() {
    const [data, setData] = useState([])
    const [differentData, setDifferentData] = useState([])
    console.log(data)
    console.log(differentData)
    setData([data.length, ...data])
    setDifferentData([...differentData, 'newDifferentData'])
}

function useState(initialValue) {
    if(!isFinite(frozenOffset))
        valueOffset++

    if(valueIndex >= frozenOffset)
        valueIndex = 0

    
    values[valueIndex] = values[valueIndex] || initialValue
    const frozenIndex = valueIndex

    const setValue = (newValue) => values[frozenIndex] = newValue
    valueIndex++

    return [values[frozenIndex], setValue]
}


function calculateComponentOffset(component) {
    if(!isFinite(frozenOffset)) {
        component()
        frozenOffset = valueOffset
    }
}

calculateComponentOffset(TestComponent)
TestComponent()
TestComponent()