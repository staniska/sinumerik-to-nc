'use babel'

export const add_dot = (replacement) => {

    const response = {
        string: replacement.string,
        errors: []
    }

    //Если пришла переменная
    if (replacement.string.match(/#/)) {
        return response
    }

    //Если точка уже есть
    if (replacement.string.match(/\./)) {
        return response
    }

    if (replacement.string.match(/-?[0-9]+/) && replacement.string.match(/-?[0-9]+/)[0] === replacement.string) {
        response.string += '.'
        return response
    }

    response.errors.push(10)
    return response
}