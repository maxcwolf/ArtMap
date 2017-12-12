const idGenerator = function* (startFrom = 0) {
    let id = 1

    while (true) {
        yield id + startFrom
        id++
    }
}
