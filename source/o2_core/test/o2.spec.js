//o2.addReady(function(){

    describe("o2对象测试",function(){
        it("uuid测试",function( done){
            var uid = o2.uuid();
            console.log("uid: "+uid);
            expect(uid).toNotEqual("");
            done();
        });
    });


//});

