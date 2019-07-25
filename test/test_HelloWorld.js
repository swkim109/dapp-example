const helloWorld = artifacts.require("HelloWorld");


contract("HelloWorld", function(accounts) {

    before( async () => {
        this.instance = await helloWorld.deployed();
    });


    it ('should have the initial value', async () => {

        const result = await instance.greeting();
        assert.equal(result, "Hello, Blockchain!", "Incorrect initial value");

    });


    it ('should change the value', async () => {

        const msg = "Hello, World!";

        await instance.setGreeting(msg, {from:accounts[0]});

        const result = await instance.say();

        assert.equal(result, msg, "Does not change the value");

    });



});

