const LandTH = artifacts.require("LandTH");

contract("LandTH", accounts => {
  it("...should be able to add a new officer", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new officer
    await LandTHInstance.addOfficer(
      "0xC81F79500B01D9b38d3Ef9C5e94E12586622541d",
      "7001",
      "e826bc77e9544c207c14e68a310dc047a6c625a0d3f7a2c38b8a44e59ec4a3ed", // sha256('7001' + '7613424585001')
      false,
      { from: accounts[1] }
    );

    // Get the officer
    const officer = await LandTHInstance.officers("0xC81F79500B01D9b38d3Ef9C5e94E12586622541d");

    assert.equal(officer.ref, "7001", "The officer wasn't added.");
  });

  it("...should check permission before adding a new officer", async () => {
    const LandTHInstance = await LandTH.deployed();

    // non-officer account
    await LandTHInstance.addOfficer(
      "0xC81F79500B01D9b38d3Ef9C5e94E12586622541d",
      "7001",
      "e826bc77e9544c207c14e68a310dc047a6c625a0d3f7a2c38b8a44e59ec4a3ed", // sha256('7001' + '7613424585001')
      false,
      { from: accounts[4] }
    ).then(result => {
      assert.fail("Didn't check for non-officer accounts");
    }, error => {
      // pass
    });

    // non-administrator account
    await LandTHInstance.addOfficer(
      "0xC81F79500B01D9b38d3Ef9C5e94E12586622541d",
      "7001",
      "e826bc77e9544c207c14e68a310dc047a6c625a0d3f7a2c38b8a44e59ec4a3ed", // sha256('7001' + '7613424585001')
      false,
      { from: accounts[2] }
    ).then(result => {
      assert.fail("Didn't check for non-administrator accounts");
    }, error => {
      // pass
    });

  });

  it("...should not allow adding officer with an address that is already used", async () => {
    const LandTHInstance = await LandTH.deployed();

    await LandTHInstance.addOfficer(
      "0x4182360aDC813c82F3B35FCABB215a23E0CcC5F6", // this address is already used by RFD's administrator
      "7001",
      "e826bc77e9544c207c14e68a310dc047a6c625a0d3f7a2c38b8a44e59ec4a3ed", // sha256('7001' + '7613424585001')
      false,
      { from: accounts[0] }
    ).then(result => {
      assert.fail("Didn't check for used addresses");
    }, error => {
      // pass
    });
  });

  it("...should be able to add a new land type", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new land type
    const result = await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[0] }
    );

    // Get the land type count
    const landTypeCount = await LandTHInstance.landTypeCount();

    // Get event
    const event = result.logs[0].args;

    assert.equal(landTypeCount.toNumber(), 1, "The land type wasn't added.");
    assert.equal(event.id.toNumber(), landTypeCount.toNumber(), "Land type ID is incorrect.");
  });

  it("...should check permission before adding a new land type", async () => {
    const LandTHInstance = await LandTH.deployed();

    // non-officer account
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[4] }
    ).then(result => {
      assert.fail("Didn't check for non-officer accounts");
    }, error => {
      // pass
    });

    // non-administrator account
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[2] }
    ).then(result => {
      assert.fail("Didn't check for non-administrator accounts");
    }, error => {
      // pass
    });

  });

  it("...should be able to add a new land", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new land type
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[0] }
    );

    // Get the land type count
    const landTypeCount = await LandTHInstance.landTypeCount();

    // Add a new land
    const result = await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[0] }
    );

    // Get the land count
    const landCount = await LandTHInstance.landCount();

    // Get event
    const event = result.logs[0].args;

    assert.equal(landCount.toNumber(), 1, "The land wasn't added.");
    assert.equal(event.id.toNumber(), landCount.toNumber(), "Land ID is incorrect.");
  });

  it("...should check permission when adding a new land", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new land type
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[0] }
    );

    // Get the land type count
    const landTypeCount = await LandTHInstance.landTypeCount();

    // non-officer account
    await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[4] }
    ).then(result => {
      assert.fail("Didn't check for non-officer accounts");
    }, error => {
      // pass
    });

    // cross-organization account
    await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[1] }
    ).then(result => {
      assert.fail("Didn't check for cross-organization accounts");
    }, error => {
      // pass
    });

    // same-organization account
    await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[2] }
    ).then(result => {
      // pass
    }, error => {
      assert.fail("Same-organization accounts unable to add land");
    });

  });

  it("...should validate inputs when adding a new land", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new land type
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[0] }
    );

    // Get the land type count
    const landTypeCount = await LandTHInstance.landTypeCount();

    // invalid land type ID
    await LandTHInstance.addLand(
      0,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[0] }
    ).then(result => {
      assert.fail("Didn't check for invalid land type ID");
    }, error => {
      // pass
    });

    // zero issue date
    await LandTHInstance.addLand(
      landTypeCount,
      0,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[0] }
    ).then(result => {
      assert.fail("Didn't check for invalid issue date");
    }, error => {
      // pass
    });

    // empty geometry
    await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "",
      { from: accounts[0] }
    ).then(result => {
      assert.fail("Didn't check for empty geometry");
    }, error => {
      // pass
    });

  });

  it("...should be able to get land by id", async () => {
    const LandTHInstance = await LandTH.deployed();

    // Add a new land type
    await LandTHInstance.addLandType(
      "LT1",
      "Land type number 1",
      { from: accounts[0] }
    );

    // Get the land type count
    const landTypeCount = await LandTHInstance.landTypeCount();

    // Add a new land
    await LandTHInstance.addLand(
      landTypeCount,
      1599380383,
      "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
      { from: accounts[0] }
    );

    // Get the land count
    const landCount = await LandTHInstance.landCount();
  
    // Get land from landCount (basically the id of latest land)
    const land = await LandTHInstance.lands(landCount);
  
    assert.equal(land.issueDate, 1599380383, "Didn't get the added land");
  });

});
