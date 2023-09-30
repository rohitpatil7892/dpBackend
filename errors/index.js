async function objectNotFound(msg) {
    throw {
        code: 404,
        name: "Object not found",
        message: msg
    }
}

async function objectAlreadyExists(msg) {
    throw {
        code: 405,
        name: "Object not found",
        message: msg
    }
}

async function notAcceptable(msg) {
    throw {
        code: 406,
        name: "Object not found",
        message: msg
    }
}

module.exports = {
    objectNotFound: objectNotFound,
    objectAlreadyExists: objectAlreadyExists,
    notAcceptable: notAcceptable
};