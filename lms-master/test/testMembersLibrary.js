'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');
const MembersLibrary = artifacts.require('../contracts/MembersLibrary.sol');
const sha3 = require('solidity-sha3').default;


contract('MembersLibrary', function(accounts) {
    let store, membersLibrary;

    beforeEach(async function() {
        store = await DataStore.new();
        membersLibrary = await MembersLibrary.new();
        // Transfer ownership of store from default account to members library. This allows modifying the data store.
        store.transferOwnership(membersLibrary.address);
        await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
    });

    describe('count', function() {
        it('should fetch the number of members added to app', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count.valueOf(), 1);
            await membersLibrary.addMember(store.address, 'Pawan Singh Pal', 'g@gmail.com', accounts[1]);
            let count2 = await membersLibrary.memberCount(store.address);
            assert.equal(count2.valueOf(), 2);
        });
    });

    describe('addMember', function() {
        it('should add a member with given details', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            let memberAttr = await membersLibrary.getMember(store.address, 1);
            assert.equal(memberAttr[0], accounts[0]);
            assert.equal(memberAttr[1], '0');
            assert.isAtMost(memberAttr[2], Math.floor(Date.now() / 1000));
            assert.isAbove(memberAttr[2], Math.floor(Date.now() / 1000) - 300);

            let name = await store.getStringValue(sha3('name', 1));
            let email = await store.getStringValue(sha3('email', 1));
            assert.equal(name, 'Abc Def');
            assert.equal(email, 'p@gmail.com');
        });
        it('should not add an already added member', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should activate removed member', async function() {
            await membersLibrary.removeMember(store.address, accounts[0]);
            assert.equal(await membersLibrary.memberCount(store.address), 1);
            let memberAttr = await membersLibrary.getMember(store.address, 1);
            assert.equal(memberAttr[1], '1');
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            memberAttr = await membersLibrary.getMember(store.address, 1);
            assert.equal(memberAttr[1], '0');
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should not add the member if email and account already associated with 2 different members', async function() {
            await membersLibrary.addMember(store.address, 'Pqr Stv', 'g@gmail.com', accounts[1]);
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[1]);
            assert.equal(res.logs[0].args.statusCode.c[0], 103);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 2);
        });
        it('should not add if email already registered with some other account', async function() {
            let res = await membersLibrary.addMember(store.address, 'Pqr Stv', 'p@gmail.com', accounts[1]);
            assert.equal(res.logs[0].args.statusCode.c[0], 104);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should not add if account already registered with some other email', async function() {
            let res = await membersLibrary.addMember(store.address, 'Pqr Stv', 'g@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 105);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
    });

    describe('removeMember', function() {
        it('should do nothing for non-existent members', async function() {
            let res = await membersLibrary.removeMember(store.address, accounts[1]);
        });
        it('should deactivate a member', async function() {
            await membersLibrary.removeMember(store.address, accounts[0]);
            let memberAttr = await membersLibrary.getMember(store.address, 1);
            assert.equal(memberAttr[1], '1');
        });
    });
});