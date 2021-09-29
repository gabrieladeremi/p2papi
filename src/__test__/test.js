const { assert } = require("joi");
const request = require("supertest");
const app = require("../app");

describe("authenticates a user", () => {
    it("POST/ should register a user", async() => {
        const data = {
            firstName: "Aderemi",
            lastName: "Amos",
            address: "57, Sambisa way, Boko Street",
            email: "aderemi@gmail.com",
            phone:"12345678967",
            password: "123456789",
            confirmPassword: "123456789"

        }
        return request(app).post('/').send(data)
        .expect('200')
        .then(function(response) {
            assert(response.email, 'aderemi@gmail.com')
        })
        .catch(error => error)
        
    });


    it("POST/ should not register a user with existing email", async() => {
        const data = {
            firstName: "Aderemi",
            lastName: "Amos",
            address: "57, Sambisa way, Boko Street",
            email: "aderemi@gmail.com",
            phone:"12345678967",
            password: "123456789",
            confirmPassword: "123456789"

        }
        return request(app).post('/').send(data)
        .expect('400')
        .then(function(response) {
            assert(response.message, 'user already exists')
        })
        .catch(error => error)
        
    })

    it("GET/ should login a register user", async() => {
        const data = {
            email: "aderemi@gmail.com",
            password: "123456789",

        }
        return request(app).get('/').send(data)
        .expect('200')
        .then(function(response) {
            assert(response.email, 'aderemi@gmail.com')
        })
        .catch(error => error)
        
    });

    it("GET/ should throw an error for invalid user details", async() => {
        const data = {
            email: "aderemi@gmail.com",
            password: "12345678",

        }
        return request(app).get('/').send(data)
        .expect('Invalid credentials')
        
    })

});

describe('deposit into user account', () => {
    it("POST/ should confirm money deposit into user account", () => {
        const data = {
            email: "aderemi@gmail.com",
            amount: 10.00
        }

        return request(app).post("/deposit").send(data)
        .expect(200)
        .then(response => {
            assert(response.amount, "10.00")
        })
        .catch (err => err)
    });
});

describe('User balance', () => {
    it("GET/ fails to retrieves user available balance when not authenticated", () => {
      
        return request(app).get("/balance")
        .expect(400)
    });
});



