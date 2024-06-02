class ApiResponse{
    constructor(statusCode, data, message="Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = 200 <= statusCode < 300
    }
}

export {ApiResponse}